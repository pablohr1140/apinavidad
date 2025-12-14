/**
 * # Prisma Organizacion Repository
 * Propósito: Repositorio Prisma Prisma Organizacion Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

/**
 * # PrismaOrganizacionRepository
 *
 * Propósito: implementación Prisma de `OrganizacionRepository` para CRUD con manejo de bigint.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `organizaciones`, normaliza ids BigInt a number.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { EstadoOrganizacion, OrganizacionProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppError } from '@/shared/errors/AppError';

type CreateInput = Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = Partial<Omit<OrganizacionProps, 'id'>>;
type OrganizacionRecord = Prisma.organizacionesGetPayload<Record<string, never>>;

@Injectable()
export class PrismaOrganizacionRepository implements OrganizacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params?: { estado?: string; tipo?: string }): Promise<OrganizacionProps[]> {
    const where: Prisma.organizacionesWhereInput = {};

    if (params?.estado) {
      where.estado = params.estado;
    }

    if (params?.tipo) {
      where.tipo = params.tipo;
    }

    const organizaciones = await this.prisma.organizaciones
      .findMany({
        where,
        orderBy: { created_at: 'desc' }
      })
      .catch((error) => {
        console.error('PrismaOrganizacionRepository.findMany error', { where, error });
        throw error;
      });

    return organizaciones.map((organizacion) => this.toDomain(organizacion));
  }

  async findById(id: number): Promise<OrganizacionProps | null> {
    const organizacion = await this.prisma.organizaciones
      .findUnique({ where: { id } })
      .catch((error) => {
        console.error('PrismaOrganizacionRepository.findById error', { id, error });
        throw error;
      });
    return organizacion ? this.toDomain(organizacion) : null;
  }

  async create(data: CreateInput): Promise<OrganizacionProps> {
    const created = await this.prisma.organizaciones.create({
      data: this.mapCreateData(data)
    });

    return this.toDomain(created);
  }

  async update(id: number, data: UpdateInput): Promise<OrganizacionProps> {
    const updated = await this.prisma.organizaciones
      .update({
        where: { id },
        data: this.mapUpdateData(data)
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new AppError('Organización no encontrada', 404);
        }
        throw error;
      });

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.organizaciones.delete({ where: { id } });
  }

  private toDomain(organizacion: OrganizacionRecord): OrganizacionProps {
    return {
      // Prisma returns SQL Server bigint columns as JS BigInt; normalize to number for JSON serialization
      id: Number(organizacion.id),
      nombre: organizacion.nombre,
      sigla: organizacion.sigla ?? undefined,
      rut: organizacion.rut ?? undefined,
      tipo: organizacion.tipo,
      direccion: organizacion.direccion ?? undefined,
      telefono: organizacion.telefono ?? undefined,
      email: organizacion.email ?? undefined,
      providenciaId: organizacion.providencia_id ?? undefined,
      estado: organizacion.estado as EstadoOrganizacion,
      createdAt: organizacion.created_at,
      updatedAt: organizacion.updated_at
    };
  }

  private mapCreateData(data: CreateInput): Prisma.organizacionesUncheckedCreateInput {
    return {
      nombre: data.nombre,
      sigla: data.sigla ?? null,
      rut: data.rut ?? null,
      tipo: data.tipo,
      direccion: data.direccion ?? null,
      telefono: data.telefono ?? null,
      email: data.email ?? null,
      providencia_id: data.providenciaId ?? null,
      estado: data.estado
    };
  }

  private mapUpdateData(data: UpdateInput): Prisma.organizacionesUpdateInput {
    const payload: Prisma.organizacionesUncheckedUpdateInput = {};

    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.sigla !== undefined) payload.sigla = data.sigla;
    if (data.rut !== undefined) payload.rut = data.rut;
    if (data.tipo !== undefined) payload.tipo = data.tipo;
    if (data.direccion !== undefined) payload.direccion = data.direccion;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email = data.email;
    if (data.providenciaId !== undefined) payload.providencia_id = data.providenciaId;
    if (data.estado !== undefined) payload.estado = data.estado;

    return payload;
  }
}
