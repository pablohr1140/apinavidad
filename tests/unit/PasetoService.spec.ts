/**
 * # Paseto Service.spec
 * Propósito: Prueba unitaria Paseto Service.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { V3 } from 'paseto';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env', () => ({
  env: {
    PASETO_SECRET: 'a'.repeat(64)
  }
}));

import { PasetoService } from '@/infra/auth/PasetoService';

describe('PasetoService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('firma y verifica tokens', async () => {
    const service = new PasetoService();
    const token = await service.sign({ sub: 'user-1' }, { expiresInMinutes: 5 });

    await expect(service.verify(token)).resolves.toMatchObject({ sub: 'user-1' });
  });

  it('rechaza tokens expirados', async () => {
    const service = new PasetoService();
    const decryptSpy = vi
      .spyOn(V3, 'decrypt')
      .mockResolvedValue({ sub: 'user-1', exp: new Date('2020-01-01T00:00:00Z') } as any);

    await expect(service.verify('fake-token')).rejects.toThrow('Token expirado');
    decryptSpy.mockRestore();
  });
});
