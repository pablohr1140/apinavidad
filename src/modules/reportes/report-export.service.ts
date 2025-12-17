/**
 * ReportExportService
 * Capa: Módulo reportes / Servicio Nest
 * Responsabilidad: Gestionar cola simple de exportes (PDF/Excel) con metadata en Redis, generar archivos async y aplicar TTL/cleanup.
 * Dependencias: ListNinosUseCase (datos), ReportingService (PDF/Excel), RedisService (metadata y TTL), fs/path, env.
 * Flujo: enqueue -> guarda meta -> procesa async -> genera buffer -> escribe archivo tmp -> actualiza estado -> cleanup tras TTL.
 * Endpoints impactados: /reportes/exports (enqueue, status, download).
 * Frontend: usa jobId devuelto por enqueue para status/download; requiere auth y permiso `ninos.view`.
 */
import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

import { CreateReporteExportDto } from '@/application/dtos/ReporteExportDTO';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import type { EstadoNino } from '@/domain/entities';
import { env } from '@/config/env';
import { RedisService } from '@/infra/cache/redis.service';
import { ReportingService } from '@/infra/reporting/reporting.service';
import { logger } from '@/shared/logger';

const JOB_META_PREFIX = 'report-export:';
const JOB_TTL_SECONDS = 60 * 60 * 48; // 48h retention
const FILE_RETENTION_MS = JOB_TTL_SECONDS * 1000;
const EXPORT_DIR = path.resolve(process.cwd(), 'tmp', 'exports');

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ExportJobMeta {
  status: JobStatus;
  format: 'pdf' | 'xlsx';
  createdAt: number;
  userId: number | string;
  error?: string;
  filePath?: string;
  expiresAt?: number;
}

@Injectable()
export class ReportExportService {
  private readonly fallback = new Map<string, ExportJobMeta>();

  constructor(
    private readonly listNinosUseCase: ListNinosUseCase,
    private readonly reportingService: ReportingService,
    private readonly redisService: RedisService
  ) {}

  async enqueue(userId: number | string, dto: CreateReporteExportDto) {
    // Encola un export: valida Redis en prod, crea jobId y metadata inicial, lanza procesamiento async.
    if (env.NODE_ENV === 'production' && !this.redisService.isEnabled) {
      throw new ServiceUnavailableException('Redis requerido para exportes en producción');
    }

    const jobId = randomUUID();
    const meta: ExportJobMeta = {
      status: 'pending',
      format: dto.format,
      createdAt: Date.now(),
      userId
    };

    logger.info({ job: 'report-export', action: 'enqueue', userId, jobId, filtros: dto, formato: dto.format, ts: meta.createdAt });

    await this.saveMeta(jobId, meta);
    setImmediate(() => this.processJob(jobId, dto).catch((err) => this.markFailed(jobId, err)));
    return { jobId, status: meta.status };
  }

  async getStatus(jobId: string) {
    // Devuelve metadata/estado del job; 404 si no existe
    const meta = await this.getMeta(jobId);
    if (!meta) throw new NotFoundException('Export job not found');
    return meta;
  }

  async getFile(jobId: string) {
    // Lee archivo generado si el estado es completed; 404 si no está listo
    const meta = await this.getMeta(jobId);
    if (!meta) throw new NotFoundException('Export job not found');
    if (meta.status !== 'completed' || !meta.filePath) {
      throw new NotFoundException('Export not ready');
    }
    const buffer = await fs.readFile(meta.filePath);
    const filename = path.basename(meta.filePath);
    return { buffer, filename, format: meta.format };
  }

  private async processJob(jobId: string, dto: CreateReporteExportDto) {
    // Procesa el job: genera datos filtrados, produce PDF/Excel, escribe archivo y marca como completed
    await this.updateMeta(jobId, { status: 'processing' });

    const data = await this.buildNinosData(dto);
    const buffer = dto.format === 'pdf'
      ? await this.reportingService.buildPdf(data, 'Reporte de niños')
      : await this.reportingService.buildExcel(data, 'Reporte de niños');

    await fs.mkdir(EXPORT_DIR, { recursive: true });
    const filePath = path.join(EXPORT_DIR, `${jobId}.${dto.format === 'pdf' ? 'pdf' : 'xlsx'}`);
    await fs.writeFile(filePath, buffer);

    await this.updateMeta(jobId, { status: 'completed', filePath });
    this.scheduleCleanup(jobId, filePath);
  }

  private async buildNinosData(dto: CreateReporteExportDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 100;
    const skip = (page - 1) * limit;

    const ninos = await this.listNinosUseCase.execute({
      periodoId: dto.periodoId,
      organizacionId: dto.organizacionId,
      estado: this.parseEstado(dto.estado),
      skip,
      take: limit
    });

    logger.info({ job: 'report-export', rows: ninos.length }, 'Generando export de niños');

    return ninos.map((nino) => ({
      ...nino,
      edad_calculada: nino.fecha_nacimiento ? this.calcularEdad(nino.fecha_nacimiento) : null
    }));
  }

  private calcularEdad(fecha?: Date | string | null) {
    if (!fecha) return null;
    const birth = new Date(fecha);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  private parseEstado(value?: string): EstadoNino | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    const allowed = ['registrado', 'inhabilitado'];
    return allowed.includes(normalized) ? (normalized as EstadoNino) : undefined;
  }

  private async getMeta(jobId: string): Promise<ExportJobMeta | null> {
    const key = `${JOB_META_PREFIX}${jobId}`;
    if (this.redisService.isEnabled) {
      const raw = await this.redisService.get(key);
      if (raw) {
        try {
          return JSON.parse(raw) as ExportJobMeta;
        } catch (err) {
          logger.warn({ err }, 'No se pudo parsear metadata de export');
        }
      }
    }
    const meta = this.fallback.get(key) ?? null;
    if (meta && meta.expiresAt && meta.expiresAt < Date.now()) {
      this.fallback.delete(key);
      return null;
    }
    return meta;
  }

  private async saveMeta(jobId: string, meta: ExportJobMeta) {
    const key = `${JOB_META_PREFIX}${jobId}`;
    const metaWithExpiry = { ...meta, expiresAt: meta.expiresAt ?? Date.now() + FILE_RETENTION_MS };
    if (this.redisService.isEnabled) {
      await this.redisService.set(key, JSON.stringify(metaWithExpiry), JOB_TTL_SECONDS);
    } else if (env.NODE_ENV !== 'production') {
      this.fallback.set(key, metaWithExpiry);
    }
  }

  private async updateMeta(jobId: string, patch: Partial<ExportJobMeta>) {
    const current = (await this.getMeta(jobId)) ?? (patch as ExportJobMeta);
    const next = { ...current, ...patch } as ExportJobMeta;
    await this.saveMeta(jobId, next);
  }

  private async markFailed(jobId: string, err: unknown) {
    logger.error({ err }, 'Export job failed');
    await this.updateMeta(jobId, { status: 'failed', error: (err as Error)?.message ?? 'Error' });
  }

  private scheduleCleanup(jobId: string, filePath: string) {
    setTimeout(async () => {
      try {
        await fs.unlink(filePath);
        await this.updateMeta(jobId, { status: 'failed', error: 'expired', filePath: undefined });
      } catch (err) {
        // ignore cleanup errors
      }
    }, FILE_RETENTION_MS);
  }
}
