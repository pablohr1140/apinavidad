/**
 * # Refresh Token Use Case.spec
 * Propósito: Prueba unitaria Refresh Token Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { TokenProvider } from '@/application/contracts/Auth';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';

describe('RefreshTokenUseCase', () => {
  it('renueva access y refresh tokens', async () => {
    const tokenProvider = {
      verify: vi.fn().mockResolvedValue({ sub: 'user-1', email: 'user@example.com' }),
      sign: vi.fn().mockResolvedValue('token')
    } as unknown as TokenProvider;
    const useCase = new RefreshTokenUseCase(tokenProvider);

    const result = await useCase.execute('old-token');

    expect(tokenProvider.verify).toHaveBeenCalledWith('old-token');
    expect(tokenProvider.sign).toHaveBeenCalledTimes(2);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
