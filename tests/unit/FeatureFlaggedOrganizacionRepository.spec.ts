/**
 * # Feature Flagged Organizacion Repository.spec
 * Propósito: Prueba unitaria Feature Flagged Organizacion Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import type { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { FeatureFlaggedOrganizacionRepository } from '@/infra/database/repositories/FeatureFlaggedOrganizacionRepository';

const createStub = () => {
  const delegate: vi.Mocked<OrganizacionRepository> = {
    findMany: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  } as unknown as vi.Mocked<OrganizacionRepository>;

  const repo = new FeatureFlaggedOrganizacionRepository(delegate as unknown as OrganizacionRepository);
  return { delegate, repo };
};

describe('FeatureFlaggedOrganizacionRepository', () => {
  it('delegates all methods to the provided repository', async () => {
    const { delegate, repo } = createStub();

    delegate.findMany.mockResolvedValueOnce([]);
    delegate.findById.mockResolvedValueOnce(null);
    delegate.create.mockResolvedValueOnce({} as any);
    delegate.update.mockResolvedValueOnce({} as any);

    await repo.findMany({ estado: 'activo' });
    await repo.findById(1);
    await repo.create({ nombre: 'x', tipo: 'ONG', estado: 'activo' } as any);
    await repo.update(1, { estado: 'activo' });
    await repo.delete(1);

    expect(delegate.findMany).toHaveBeenCalledWith({ estado: 'activo', tipo: undefined });
    expect(delegate.findById).toHaveBeenCalledWith(1);
    expect(delegate.create).toHaveBeenCalledWith({ nombre: 'x', tipo: 'ONG', estado: 'activo' } as any);
    expect(delegate.update).toHaveBeenCalledWith(1, { estado: 'activo' });
    expect(delegate.delete).toHaveBeenCalledWith(1);
  });
});
