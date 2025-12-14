/**
 * # Permissions Guard.spec
 * Propósito: Prueba unitaria Permissions Guard.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { PermissionCode } from '@/domain/access-control';
import type { PermissionsMetadata } from '@/modules/auth/decorators/permissions.decorator';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';

const makeContext = (user?: AuthenticatedUser) => {
  const request = { user } as any;
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: vi.fn(),
    getClass: vi.fn()
  } as unknown as ExecutionContext;
};

const makeUser = (permissions: PermissionCode[]): AuthenticatedUser => ({
  id: 1,
  email: 'user@example.com',
  roles: [],
  permissions: new Set(permissions)
});

const makeGuard = (metadata: PermissionsMetadata | PermissionCode[] | undefined) => {
  const reflector = {
    getAllAndOverride: vi.fn().mockReturnValue(metadata)
  } as unknown as Reflector;

  return new PermissionsGuard(reflector);
};

describe('PermissionsGuard', () => {
  it('permite paso cuando no hay metadatos', () => {
    const guard = makeGuard(undefined);
    const context = makeContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('autoriza cuando el usuario tiene al menos un permiso requerido (modo any)', () => {
    const metadata: PermissionsMetadata = { mode: 'any', permissions: ['ninos.view', 'personas.view'] };
    const guard = makeGuard(metadata);
    const context = makeContext(makeUser(['personas.view']));

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rechaza cuando falta usuario autenticado', () => {
    const guard = makeGuard({ mode: 'any', permissions: ['ninos.view'] });
    const context = makeContext();

    expect(() => guard.canActivate(context)).toThrowError(ForbiddenException);
  });

  it('rechaza cuando se requieren todos los permisos y falta uno', () => {
    const guard = makeGuard({ mode: 'all', permissions: ['ninos.view', 'personas.delete'] });
    const context = makeContext(makeUser(['ninos.view']));

    expect(() => guard.canActivate(context)).toThrowError(ForbiddenException);
  });

  it('es compatible con metadatos antiguos basados en arrays', () => {
    const guard = makeGuard(['ninos.view']);
    const context = makeContext(makeUser(['ninos.view']));

    expect(guard.canActivate(context)).toBe(true);
  });
});
