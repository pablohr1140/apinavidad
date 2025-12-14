/**
 * # PrismaUserRepository
 *
 * Propósito: implementación Prisma de `UserRepository` para autenticación.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `personas` con join a roles; retorna `UserRecord`.
 */
import { Injectable } from '@nestjs/common';
import { UserRepository, UserRecord } from '@/application/repositories/UserRepository';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import type { RoleKey } from '@/domain/access-control';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca usuario por email incluyendo rol, normaliza a `UserRecord`. */
  async findByEmail(email: string): Promise<UserRecord | null> {
    const persona = await this.prisma.personas.findFirst({
      where: { email: { equals: email } },
      include: { roles: true }
    });

    if (!persona || !persona.password || !persona.email) {
      return null;
    }

    const role = persona.roles
      ? [persona.roles].filter(Boolean).map((r) => ({ id: r!.id, key: r!.role_key as RoleKey, name: r!.name, rank: r!.rank }))
      : [];

    return {
      id: persona.id,
      email: persona.email,
      passwordHash: persona.password,
      roles: role,
      createdAt: persona.created_at,
      updatedAt: persona.updated_at
    };
  }
}
