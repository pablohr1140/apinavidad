/**
 * # authorization.service
 * Propósito: Servicio authorization.service
 * Pertenece a: Servicio de módulo (Nest)
 * Interacciones: Repositorios, servicios externos
 */

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { PermissionCode, RoleKey } from '@/domain/access-control';
import { RedisService } from '@/infra/cache/redis.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

const ROLE_CACHE_PREFIX = 'role-permissions:';
const ROLE_CACHE_TTL_SECONDS = 60 * 10; // 10 minutos

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}

  async buildUserContext(userId: number, fallbackEmail?: string): Promise<AuthenticatedUser> {
    const persona = await this.prisma.personas.findUnique({
      where: { id: userId },
      include: { roles: true }
    });

    if (!persona) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const roleSummaries = persona.roles
      ? [persona.roles].filter(Boolean).map((role) => ({
          id: role!.id,
          key: role!.role_key as RoleKey,
          name: role!.name,
          rank: role!.rank
        }))
      : [];

    const permissions = await this.aggregatePermissions(roleSummaries.map((role) => role.key));

    return {
      id: persona.id,
      email: persona.email ?? fallbackEmail ?? '',
      roles: roleSummaries,
      permissions
    };
  }

  async invalidateRoleCache(roleKey: RoleKey) {
    await this.redisService.del(`${ROLE_CACHE_PREFIX}${roleKey}`);
  }

  /**
   * Valida que el rol "actor" pueda eliminar al rol objetivo usando el rank.
   * Si el objetivo tiene un rank mayor o igual, lanza Forbidden.
   */
  async assertCanDeleteRole(actorRoleKey: RoleKey, targetRoleKey: RoleKey) {
    const [actor, target] = await Promise.all([
      this.prisma.roles.findUnique({ where: { role_key: actorRoleKey }, select: { rank: true } }),
      this.prisma.roles.findUnique({ where: { role_key: targetRoleKey }, select: { rank: true } })
    ]);

    if (!actor || !target) {
      // Si no existen, dejamos que la capa superior gestione el 404/ lógica adicional.
      return;
    }

    if (target.rank >= actor.rank) {
      throw new ForbiddenException('No puedes eliminar un rol de igual o mayor jerarquía.');
    }
  }

  private async aggregatePermissions(roleKeys: RoleKey[]) {
    const codes = new Set<PermissionCode>();
    const uniqueKeys = Array.from(new Set(roleKeys));

    for (const key of uniqueKeys) {
      const rolePermissions = await this.resolveRolePermissions(key);
      rolePermissions.forEach((perm) => codes.add(perm));
    }

    return codes;
  }

  private async resolveRolePermissions(roleKey: RoleKey): Promise<PermissionCode[]> {
    const cacheKey = `${ROLE_CACHE_PREFIX}${roleKey}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached) as PermissionCode[];
      } catch {
        // ignore cache parsing errors and rebuild payload
      }
    }

    const role = await this.prisma.roles.findUnique({
      where: { role_key: roleKey },
      include: {
        role_permissions: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!role) {
      return [];
    }

    const permissions = (role.role_permissions ?? []).map(
      (permission) => `${permission.permissions.resource}.${permission.permissions.action}` as PermissionCode
    );

    await this.redisService.set(cacheKey, JSON.stringify(permissions), ROLE_CACHE_TTL_SECONDS);

    return permissions;
  }
}
