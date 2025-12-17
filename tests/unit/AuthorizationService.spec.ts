/**
 * # Authorization Service.spec
 * Propósito: Prueba unitaria Authorization Service.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import type { RoleKey } from '@/domain/access-control';
import type { RedisService } from '@/infra/cache/redis.service';
import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';

describe('AuthorizationService', () => {
  let prisma: Pick<PrismaService, 'personas' | 'roles'>;
  let redisService: Pick<RedisService, 'get' | 'set' | 'del'>;
  let service: AuthorizationService;

  beforeEach(() => {
    prisma = {
      personas: { findUnique: vi.fn() },
      roles: { findUnique: vi.fn() }
    } as unknown as PrismaService;

    redisService = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn()
    };

    service = new AuthorizationService(prisma as PrismaService, redisService as RedisService);
  });

  it('builds user context using fallback email and cached permissions', async () => {
    (prisma.personas.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: 1,
      email: null,
      roles: { id: 9, role_key: 'ADMIN', name: 'Admin', rank: 400 }
    });

    (redisService.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      JSON.stringify(['personas.view', 'ninos.create'])
    );

    const user = await service.buildUserContext(1, 'fallback@example.com');

    expect(prisma.personas.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { roles: true }
    });
    expect(user.email).toBe('fallback@example.com');
    expect(Array.from(user.permissions)).toEqual(['personas.view', 'ninos.create']);
    expect(prisma.roles.findUnique).not.toHaveBeenCalled();
  });

  it('throws when persona is not found', async () => {
    (prisma.personas.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    await expect(service.buildUserContext(99)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('caches permissions when redis misses or has invalid payload', async () => {
    (redisService.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce('not-json');
    (prisma.roles.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      role_permissions: [
        { permissions: { resource: 'personas', action: 'view' } },
        { permissions: { resource: 'ninos', action: 'create' } }
      ]
    });

    const permissions = await (service as unknown as { resolveRolePermissions(roleKey: RoleKey): Promise<string[]> }).resolveRolePermissions('ADMIN');

    expect(permissions).toEqual(['personas.view', 'ninos.create']);
    expect(redisService.set).toHaveBeenCalledWith(
      'role-permissions:ADMIN',
      JSON.stringify(['personas.view', 'ninos.create']),
      600
    );
  });

  it('returns empty permissions and skips cache writes when role does not exist', async () => {
    (redisService.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
    (prisma.roles.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    const permissions = await (service as unknown as { resolveRolePermissions(roleKey: RoleKey): Promise<string[]> }).resolveRolePermissions('ADMIN');

    expect(permissions).toEqual([]);
    expect(redisService.set).not.toHaveBeenCalled();
  });

  it('invalidates cache entries when requested', async () => {
    await service.invalidateRoleCache('ADMIN');
    expect(redisService.del).toHaveBeenCalledWith('role-permissions:ADMIN');
  });

  it('invalidates multiple caches when requested', async () => {
    await service.invalidateRolesCache(['ADMIN', 'SUP']);
    expect(redisService.del).toHaveBeenCalledWith('role-permissions:ADMIN');
    expect(redisService.del).toHaveBeenCalledWith('role-permissions:SUP');
  });
});
