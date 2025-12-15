/**
 * # Prisma Discapacidad Repository
 * Propósito: Repositorio Prisma Prisma Discapacidad Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { DiscapacidadRepository } from '@/application/repositories/DiscapacidadRepository';
import { DiscapacidadProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaDiscapacidadRepository implements DiscapacidadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params?: { activo?: boolean }): Promise<DiscapacidadProps[]> {
    const discapacidades = await this.prisma.discapacidades.findMany({
      where: params?.activo !== undefined ? { activo: params.activo } : {},
      orderBy: { created_at: 'desc' }
    });

    return discapacidades.map((d) => this.toDomain(d));
  }

  async create(data: Omit<DiscapacidadProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscapacidadProps> {
    const created = await this.prisma.discapacidades.create({
      data: {
        nombre: data.nombre,
        activo: data.activo
      }
    });

    return this.toDomain(created);
  }

  private toDomain(
    entity: { id: number; nombre: string; activo: boolean; created_at?: Date; updated_at?: Date }
  ): DiscapacidadProps {
    return {
      id: entity.id,
      nombre: entity.nombre,
      categoria: undefined,
      codigo: undefined,
      descripcion: undefined,
      activo: Boolean(entity.activo),
      createdAt: (entity as any).created_at ?? new Date(),
      updatedAt: (entity as any).updated_at ?? new Date()
    };
  }
}
