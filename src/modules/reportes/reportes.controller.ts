/**
 * ReportesController
 * Capa: Interface / HTTP (NestJS)
 * Responsabilidad: Listar niños para reportes y generar exportes síncronos (PDF/Excel) o asíncronos en cola.
 * Seguridad actual: todas las rutas requieren guard global + `@Permissions('ninos.view')`. CSRF: aplicar `X-CSRF-Token` en POST `/reportes/exports`.
 * Endpoints y contratos:
 *  - GET /reportes/ninos/listado: Query { periodoId?, organizacionId?, estado?, page?, limit<=500 }; resp JSON { total, data[] }.
 *  - GET /reportes/ninos/listado.pdf|.xlsx: mismos filtros; descarga binaria con Content-Disposition.
 *  - POST /reportes/exports: Body { format: 'pdf'|'xlsx', periodoId?, organizacionId?, estado?, page?, limit<=500 }; resp { jobId }.
 *  - GET /reportes/exports/:jobId: resp { status, progress?, error?, downloadUrl? } según implementación del servicio.
 *  - GET /reportes/exports/:jobId/download: descarga binaria; headers de filename/Content-Type.
 * Headers/cookies: requiere cookies de auth; `X-CSRF-Token` en POST; Authorization Bearer opcional si se usa header.
 * Ejemplo de integración frontend (descriptivo): para tablas usa GET listado con paginación; para export, POST /exports guardando jobId y hacer polling a /exports/:jobId hasta completed y luego GET download con cookies.
 */
import { Body, Controller, Get, Logger, Param, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { ListadoReportesQueryDto } from '@/application/dtos/ReporteDTOs';
import { CreateReporteExportDto } from '@/application/dtos/ReporteExportDTO';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { calcularEdad, MAX_EDAD } from '@/domain/services/ninoRules';
import type { EstadoNino } from '@/domain/entities';
import { ReportingService } from '@/infra/reporting/reporting.service';
import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ReportExportService } from './report-export.service';

@Controller('reportes')
export class ReportesController {
  private readonly logger = new Logger(ReportesController.name);

  constructor(
    private readonly listNinosUseCase: ListNinosUseCase,
    private readonly reportingService: ReportingService,
    private readonly reportExportService: ReportExportService
  ) {}

  @Permissions('ninos.view')
  @Get('ninos/inhabilitados')
  async listInhabilitados() {
    const ninos = await this.listNinosUseCase.execute({ estado: 'inhabilitado' });
    return { total: ninos.length, data: ninos };
  }

  @Permissions('ninos.view')
  @Get('ninos/listado')
  async listado(
    @Query() query: ListadoReportesQueryDto
  ) {
    /**
     * Retorna listado paginado en JSON.
     * Query: periodoId?, organizacionId?, estado?, page?, limit (<=500).
     * Frontend: usar para vistas; requiere cookie auth y CSRF en mutaciones (aquí es GET, no requiere header CSRF).
     */
    const data = await this.buildNinosData(query);
    return { total: data.length, data };
  }

  @Permissions('ninos.view')
  @Get('ninos/listado.pdf')
  async listadoPdf(
    @Query() query: ListadoReportesQueryDto,
    @Res() res: Response
  ) {
    /**
     * Genera y descarga PDF síncrono con el listado filtrado.
     * Query: mismos filtros de listado.
     * Frontend: GET directo; requiere auth/permiso; tamaño moderado recomendado.
     */
    const data = await this.buildNinosData(query);
    this.logger.log(`listadoPdf rows=${data.length}`);
    const pdf = await this.reportingService.buildPdf(data, 'Reporte de niños');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.pdf"');
    res.send(pdf);
  }

  @Permissions('ninos.view')
  @Get('ninos/listado.xlsx')
  async listadoExcel(
    @Query() query: ListadoReportesQueryDto,
    @Res() res: Response
  ) {
    /**
     * Genera y descarga Excel síncrono con el listado filtrado.
     * Query: mismos filtros de listado.
     * Frontend: GET directo; requiere auth/permiso; usar para volúmenes moderados.
     */
    const data = await this.buildNinosData(query);
    const xlsx = await this.reportingService.buildExcel(data, 'Reporte de niños');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.xlsx"');
    res.send(xlsx);
  }

  @Permissions('ninos.view')
  @Post('exports')
  async enqueueExport(
    @Body() body: CreateReporteExportDto,
    @AuthUser() user: AuthenticatedUser
  ) {
    /**
     * Encola export asíncrono (PDF/Excel) usando Redis.
     * Body: { format: 'pdf'|'xlsx', periodoId?, organizacionId?, estado?, page?, limit<=500 }.
     * Frontend: POST con CSRF header y cookies de auth; recibe jobId para consultar estado.
     */
    return this.reportExportService.enqueue(user.id, body);
  }

  @Permissions('ninos.view')
  @Get('exports/:jobId')
  async exportStatus(@Param('jobId') jobId: string) {
    /**
     * Consulta estado del export (pending/processing/completed/failed/expired).
     * Frontend: GET polling hasta completed.
     */
    return this.reportExportService.getStatus(jobId);
  }

  @Permissions('ninos.view')
  @Get('exports/:jobId/download')
  async downloadExport(@Param('jobId') jobId: string, @Res() res: Response) {
    /**
     * Descarga el archivo de export listo.
     * Frontend: tras estado completed, GET a esta ruta; maneja Content-Type según formato.
     */
    const result = await this.reportExportService.getFile(jobId);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Type', result.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(result.buffer);
  }

  private async buildNinosData(query: ListadoReportesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    const ninos = await this.listNinosUseCase.execute({
      periodoId: query.periodoId,
      organizacionId: query.organizacionId,
      estado: this.parseEstado(query.estado),
      skip,
      take: limit
    });

    this.logger.log(`buildNinosData rows=${ninos.length}`);

    return ninos.map((nino) => {
      const edadCalculada = calcularEdad(nino.fecha_nacimiento);
      const tiempoParaInhabilitar = edadCalculada != null ? Math.max(0, MAX_EDAD - edadCalculada) : null;
      return {
        ...nino,
        edad_calculada: edadCalculada,
        tiempo_para_inhabilitar: tiempoParaInhabilitar
      };
    });
  }

  private parseEstado(value?: string): EstadoNino | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    const allowed = ['registrado', 'inhabilitado'];
    return allowed.includes(normalized) ? (normalized as EstadoNino) : undefined;
  }
}
