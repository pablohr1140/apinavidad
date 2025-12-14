/**
 * # Delete Organizacion Use Case.spec
 * Propósito: Prueba unitaria Delete Organizacion Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends OrganizacionRepository {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  delete: vi.fn()
}) as unknown as RepoMock;

describe('DeleteOrganizacionUseCase', () => {
  it('lanza error si no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new DeleteOrganizacionUseCase(repository);

    await expect(useCase.execute(1)).rejects.toBeInstanceOf(AppError);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('elimina cuando encuentra la organización', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.delete.mockResolvedValue(undefined);
    const useCase = new DeleteOrganizacionUseCase(repository);

    await useCase.execute(1);

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
