/**
 * # Paseto Auth Guard.spec
 * Propósito: Prueba unitaria Paseto Auth Guard.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/config/auth';
import { PasetoService } from '@/infra/auth/PasetoService';
import { PasetoAuthGuard } from '@/modules/auth/guards/paseto-auth.guard';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';

const makeContext = (headers: Record<string, string> = {}, cookies: Record<string, string> = {}) => {
  const request = { headers, cookies, user: undefined } as any;
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: vi.fn(),
    getClass: vi.fn()
  } as unknown as ExecutionContext;
  return { context, request };
};

const makeAuthorizationService = () => {
  const authUser = {
    id: 1,
    email: 'user@example.com',
    roles: [],
    permissions: new Set()
  };
  const buildUserContext = vi.fn().mockResolvedValue(authUser);
  const authorizationService = { buildUserContext } as unknown as AuthorizationService;
  return { authorizationService, authUser, buildUserContext };
};

describe('PasetoAuthGuard', () => {
  it('permite rutas publicas sin token', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(true) } as unknown as Reflector;
    const pasetoService = { verify: vi.fn() } as unknown as PasetoService;
    const { authorizationService } = makeAuthorizationService();
    const guard = new PasetoAuthGuard(reflector, pasetoService, authorizationService);
    const { context } = makeContext();

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(pasetoService.verify).not.toHaveBeenCalled();
  });

  it('adjunta el payload cuando el token es valido desde header', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const pasetoService = { verify: vi.fn().mockResolvedValue({ sub: '1', email: 'user@example.com' }) } as unknown as PasetoService;
    const { authorizationService, authUser, buildUserContext } = makeAuthorizationService();
    const guard = new PasetoAuthGuard(reflector, pasetoService, authorizationService);
    const { context, request } = makeContext({ authorization: 'Bearer token' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(buildUserContext).toHaveBeenCalledWith(1, 'user@example.com');
    expect(request.user).toBe(authUser);
  });

  it('usa cookies cuando no hay header', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const pasetoService = { verify: vi.fn().mockResolvedValue({ sub: '2', email: 'cookie@example.com' }) } as unknown as PasetoService;
    const { authorizationService, authUser, buildUserContext } = makeAuthorizationService();
    const guard = new PasetoAuthGuard(reflector, pasetoService, authorizationService);
    const { context, request } = makeContext({}, { [ACCESS_TOKEN_COOKIE_NAME]: 'cookie-token' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(pasetoService.verify).toHaveBeenCalledWith('cookie-token');
    expect(buildUserContext).toHaveBeenCalledWith(2, 'cookie@example.com');
    expect(request.user).toBe(authUser);
  });

  it('rechaza cuando falta el header', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const pasetoService = { verify: vi.fn() } as unknown as PasetoService;
    const { authorizationService } = makeAuthorizationService();
    const guard = new PasetoAuthGuard(reflector, pasetoService, authorizationService);
    const { context } = makeContext();

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rechaza tokens invalidos', async () => {
    const reflector = { getAllAndOverride: vi.fn().mockReturnValue(false) } as unknown as Reflector;
    const pasetoService = {
      verify: vi.fn().mockRejectedValue(new Error('invalid'))
    } as unknown as PasetoService;
    const { authorizationService } = makeAuthorizationService();
    const guard = new PasetoAuthGuard(reflector, pasetoService, authorizationService);
    const { context } = makeContext({ authorization: 'Bearer bad' });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
