/**
 * # Bcrypt Provider.spec
 * Propósito: Prueba unitaria Bcrypt Provider.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { compare, hash } from 'bcryptjs';
import { describe, expect, it, vi } from 'vitest';

import { BcryptProvider } from '@/infra/security/BcryptProvider';

vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
  compare: vi.fn()
}));

const mockedHash = hash as unknown as ReturnType<typeof vi.fn>;
const mockedCompare = compare as unknown as ReturnType<typeof vi.fn>;

describe('BcryptProvider', () => {
  it('delegates hash con 10 rondas', async () => {
    const provider = new BcryptProvider();
    mockedHash.mockResolvedValue('hashed');

    const result = await provider.hash('secret');

    expect(hash).toHaveBeenCalledWith('secret', 10);
    expect(result).toBe('hashed');
  });

  it('delegates compare', async () => {
    const provider = new BcryptProvider();
    mockedCompare.mockResolvedValue(true);

    const result = await provider.compare('plain', 'hash');

    expect(compare).toHaveBeenCalledWith('plain', 'hash');
    expect(result).toBe(true);
  });
});
