/**
 * # Refresh Token Use Case.spec
 * Propósito: Prueba unitaria Refresh Token Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { TokenProvider } from '@/application/contracts/Auth';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import { RefreshTokenStore } from '@/modules/auth/services/refresh-token.store';

describe('RefreshTokenUseCase', () => {
  it('renueva access y refresh tokens', async () => {
    const tokenProvider = {
      verify: vi.fn().mockResolvedValue({
        sub: 'user-1',
        email: 'user@example.com',
        sessionId: 's1',
        tokenVersion: 1,
        tokenType: 'refresh'
      }),
      sign: vi.fn().mockResolvedValue('token')
    } as unknown as TokenProvider;
    const store = {
      isCurrent: vi.fn().mockResolvedValue(true),
      rotate: vi.fn().mockResolvedValue(undefined)
    } as unknown as RefreshTokenStore;
    const useCase = new RefreshTokenUseCase(tokenProvider, store);

    const result = await useCase.execute('old-token');

    expect(tokenProvider.verify).toHaveBeenCalledWith('old-token');
    expect(tokenProvider.sign).toHaveBeenCalledTimes(2);
    expect(store.isCurrent).toHaveBeenCalledWith('user-1', 's1', 1);
    expect(store.rotate).toHaveBeenCalledWith('user-1', 's1', 2);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('rechaza reuse cuando la version no coincide', async () => {
    const tokenProvider = {
      verify: vi.fn().mockResolvedValue({
        sub: 'user-1',
        email: 'user@example.com',
        sessionId: 's1',
        tokenVersion: 3,
        tokenType: 'refresh'
      })
    } as unknown as TokenProvider;
    const store = {
      isCurrent: vi.fn().mockResolvedValue(false)
    } as unknown as RefreshTokenStore;
    const useCase = new RefreshTokenUseCase(tokenProvider, store);

    await expect(useCase.execute('old-token')).rejects.toThrow('Refresh token reutilizado o revocado');
  });
});
