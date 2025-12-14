/**
 * # Auth Controller.spec
 * Propósito: Prueba unitaria Auth Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import type { Request, Response } from 'express';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import type { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/config/auth';
import { AuthController } from '@/modules/auth/auth.controller';

const mockUseCase = <T>(execute = vi.fn()) => ({ execute }) as unknown as T;

describe('AuthController', () => {
  let loginExecute: ReturnType<typeof vi.fn>;
  let refreshExecute: ReturnType<typeof vi.fn>;
  let controller: AuthController;

  beforeEach(() => {
    loginExecute = vi.fn();
    refreshExecute = vi.fn();
    controller = new AuthController(
      mockUseCase<LoginUseCase>(loginExecute),
      mockUseCase<RefreshTokenUseCase>(refreshExecute)
    );
  });

  const makeResponse = () => ({ cookie: vi.fn() }) as unknown as Response;
  const makeRequest = (cookies: Record<string, string> = {}) => ({ cookies }) as Request;

  it('delegates login to LoginUseCase y setea cookies', async () => {
    const dto = { email: 'test@example.com', password: 'secret123' } as const;
    loginExecute.mockResolvedValue({
      accessToken: 'abc',
      refreshToken: 'def',
      user: { id: 1, email: dto.email, roles: ['SUPERADMIN'] }
    });
    const response = makeResponse();

    const result = await controller.login(dto, response);

    expect(loginExecute).toHaveBeenCalledWith(dto);
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      accessToken: 'abc',
      refreshToken: 'def',
      user: { id: 1, email: dto.email, roles: ['SUPERADMIN'] }
    });
  });

  it('delegates refresh to RefreshTokenUseCase usando body', async () => {
    const dto = { refreshToken: 'refresh-token' } as const;
    refreshExecute.mockResolvedValue({ accessToken: 'aaa', refreshToken: 'bbb' });
    const response = makeResponse();

    const result = await controller.refresh(dto, makeRequest(), response);

    expect(refreshExecute).toHaveBeenCalledWith('refresh-token');
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ accessToken: 'aaa', refreshToken: 'bbb' });
  });

  it('usa cookie cuando no llega refreshToken en el body', async () => {
    refreshExecute.mockResolvedValue({ accessToken: 'aaa', refreshToken: 'bbb' });
    const cookieValue = 'cookie-refresh';
    const response = makeResponse();

    await controller.refresh({}, makeRequest({ [REFRESH_TOKEN_COOKIE_NAME]: cookieValue }), response);

    expect(refreshExecute).toHaveBeenCalledWith(cookieValue);
  });
});
