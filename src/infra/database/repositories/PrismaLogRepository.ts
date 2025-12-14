/**
 * # Prisma Log Repository
 * Propósito: Repositorio Prisma Prisma Log Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

/**
 * # PrismaLogRepository
 *
 * Propósito: implementación Prisma de `LogRepository` para persistir auditoría.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `logs`, serializa payload a JSON.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { LogRepository } from '@/application/repositories/LogRepository';
import { LogProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaLogRepository implements LogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<LogProps, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: Date; updatedAt?: Date }): Promise<LogProps> {
    const created = await this.prisma.logs.create({ data: this.toPersistence(data) });
    return this.toDomain(created);
  }

  private toPersistence(data: Omit<LogProps, 'id' | 'createdAt' | 'updatedAt'>): Prisma.logsUncheckedCreateInput {
    return {
      user_id: data.personaId ?? null,
      accion: data.accion,
      mensaje: data.mensaje ?? null,
      loggable_id: BigInt(data.loggableId),
      loggable_type: data.loggableType,
      payload: data.payload ? JSON.stringify(data.payload) : null,
      ip: data.ip ?? null,
      user_agent: data.user_agent ?? null
    };
  }

  private toDomain(entity: Prisma.logsUncheckedCreateInput & { id: number; created_at?: Date; updated_at?: Date }): LogProps {
    return {
      id: entity.id,
      personaId: entity.user_id ?? undefined,
      accion: entity.accion,
      mensaje: entity.mensaje ?? undefined,
      loggableId: Number(entity.loggable_id),
      loggableType: entity.loggable_type,
      payload: entity.payload ? (JSON.parse(entity.payload) as Record<string, unknown>) : null,
      ip: entity.ip ?? undefined,
      user_agent: entity.user_agent ?? undefined,
      createdAt: (entity as any).created_at ?? new Date(),
      updatedAt: (entity as any).updated_at ?? new Date()
    };
  }
}
