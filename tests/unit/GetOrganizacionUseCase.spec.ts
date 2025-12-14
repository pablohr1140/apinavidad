/**
 * # Get Organizacion Use Case.spec
 * Propósito: Prueba unitaria Get Organizacion Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = OrganizacionRepository & {
  findMany: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock => ({
  findMany: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}) as unknown as RepoMock;

describe('GetOrganizacionUseCase', () => {
  it('retorna la organización cuando existe', async () => {
    const repository = makeRepository();
    const organizacion = { id: 2, nombre: 'Org' } as any;
    repository.findById.mockResolvedValue(organizacion);
    const useCase = new GetOrganizacionUseCase(repository);

    const result = await useCase.execute(2);

    expect(repository.findById).toHaveBeenCalledWith(2);
    expect(result).toBe(organizacion);
  });

  it('lanza AppError cuando no encuentra la organización', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new GetOrganizacionUseCase(repository);

    await expect(useCase.execute(99)).rejects.toBeInstanceOf(AppError);
  });
});
