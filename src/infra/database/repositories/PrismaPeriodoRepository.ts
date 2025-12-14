/**
 * # Prisma Periodo Repository
 * Propósito: Repositorio Prisma Prisma Periodo Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

/**
 * # PrismaPeriodoRepository
 *
 * Propósito: implementación Prisma de `PeriodoRepository` para CRUD y cambios de estado.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `periodos`, transacción para activar periodo único.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { EstadoPeriodo, PeriodoProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaPeriodoRepository implements PeriodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params?: { estado?: string; activo?: boolean }): Promise<PeriodoProps[]> {
    const where: Prisma.periodosWhereInput = {
      ...(params?.estado ? { estado_periodo: params.estado } : {}),
      ...(params?.activo !== undefined ? { es_activo: params.activo } : {})
    };

    const periodos = await this.prisma.periodos.findMany({ where, orderBy: { created_at: 'desc' } });
    return periodos.map((periodo) => this.toDomain(periodo));
  }

  async findById(id: number): Promise<PeriodoProps | null> {
    const periodo = await this.prisma.periodos.findUnique({ where: { id } });
    return periodo ? this.toDomain(periodo) : null;
  }

  async create(data: Omit<PeriodoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<PeriodoProps> {
    const created = await this.prisma.periodos.create({ data: this.mapCreateData(data) });
    return this.toDomain(created);
  }

  async update(id: number, data: Partial<Omit<PeriodoProps, 'id'>>): Promise<PeriodoProps> {
    const updated = await this.prisma.periodos.update({ where: { id }, data: this.mapUpdateData(data) });
    return this.toDomain(updated);
  }

  async open(id: number): Promise<PeriodoProps> {
    const updated = await this.prisma.periodos.update({ where: { id }, data: { estado_periodo: 'abierto' } });
    return this.toDomain(updated);
  }

  async close(id: number): Promise<PeriodoProps> {
    const updated = await this.prisma.periodos.update({ where: { id }, data: { estado_periodo: 'cerrado', es_activo: false } });
    return this.toDomain(updated);
  }

  /** Desactiva todos y activa el periodo dado dentro de una transacción. */
  async activate(id: number): Promise<PeriodoProps> {
    const periodo = await this.prisma.$transaction(async (tx) => {
      await tx.periodos.updateMany({ data: { es_activo: false } });
      return tx.periodos.update({ where: { id }, data: { es_activo: true, estado_periodo: 'abierto' } });
    });

    return this.toDomain(periodo);
  }

  private mapCreateData(data: Omit<PeriodoProps, 'id' | 'createdAt' | 'updatedAt'>): Prisma.periodosCreateInput {
    return {
      nombre: data.nombre,
      fecha_inicio: data.fecha_inicio ?? null,
      fecha_fin: data.fecha_fin ?? null,
      estado_periodo: data.estado_periodo,
      es_activo: data.es_activo,
      descripcion: data.descripcion ?? null
    };
  }

  private mapUpdateData(data: Partial<Omit<PeriodoProps, 'id'>>): Prisma.periodosUpdateInput {
    const payload: Prisma.periodosUpdateInput = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.fecha_inicio !== undefined) payload.fecha_inicio = data.fecha_inicio ?? null;
    if (data.fecha_fin !== undefined) payload.fecha_fin = data.fecha_fin ?? null;
    if (data.estado_periodo !== undefined) payload.estado_periodo = data.estado_periodo;
    if (data.es_activo !== undefined) payload.es_activo = data.es_activo;
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion ?? null;
    return payload;
  }

  private toDomain(
    entity: Prisma.periodosUncheckedCreateInput & { id: number; created_at?: Date; updated_at?: Date }
  ): PeriodoProps {
    return {
      id: entity.id,
      nombre: entity.nombre,
      fecha_inicio: entity.fecha_inicio ? new Date(entity.fecha_inicio) : undefined,
      fecha_fin: entity.fecha_fin ? new Date(entity.fecha_fin) : undefined,
      estado_periodo: entity.estado_periodo as EstadoPeriodo,
      es_activo: Boolean(entity.es_activo),
      descripcion: entity.descripcion ?? undefined,
      createdAt: (entity as any).created_at ?? new Date(),
      updatedAt: (entity as any).updated_at ?? new Date()
    };
  }
}
