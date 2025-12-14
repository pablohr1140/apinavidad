/**
 * # Feature Flagged Persona Repository.spec
 * Propósito: Prueba unitaria Feature Flagged Persona Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi, type Mocked } from 'vitest';

import type { PersonaRepository, PersonaCreateInput, PersonaUpdateInput } from '@/application/repositories/PersonaRepository';
import { FeatureFlaggedPersonaRepository } from '@/infra/database/repositories/FeatureFlaggedPersonaRepository';

const createStub = () => {
  const delegate: Mocked<PersonaRepository> = {
    findMany: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  } as unknown as Mocked<PersonaRepository>;

  const repo = new FeatureFlaggedPersonaRepository(delegate as unknown as PersonaRepository);
  return { delegate, repo };
};

describe('FeatureFlaggedPersonaRepository', () => {
  it('delegates all methods to the provided repository', async () => {
    const { delegate, repo } = createStub();

    delegate.findMany.mockResolvedValueOnce([]);
    delegate.findById.mockResolvedValueOnce(null);
    delegate.create.mockResolvedValueOnce({ id: 1 } as any);
    delegate.update.mockResolvedValueOnce({ id: 1 } as any);

    await repo.findMany({ search: 'a' });
    await repo.findById(1);
    await repo.create({} as PersonaCreateInput);
    await repo.update(1, {} as PersonaUpdateInput);
    await repo.delete(1);

    expect(delegate.findMany).toHaveBeenCalledWith({ organizacionId: undefined, search: 'a' });
    expect(delegate.findById).toHaveBeenCalledWith(1);
    expect(delegate.create).toHaveBeenCalled();
    expect(delegate.update).toHaveBeenCalledWith(1, {});
    expect(delegate.delete).toHaveBeenCalledWith(1);
  });
});
