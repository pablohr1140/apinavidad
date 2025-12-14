/**
 * # Update Organizacion Use Case.spec
 * Propósito: Prueba unitaria Update Organizacion Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends OrganizacionRepository {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  update: vi.fn()
}) as unknown as RepoMock;

describe('UpdateOrganizacionUseCase', () => {
  it('lanza AppError si no existe organización', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new UpdateOrganizacionUseCase(repository);

    await expect(useCase.execute(1, {})).rejects.toBeInstanceOf(AppError);
  });

  it('actualiza con payload válido', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue({ id: 1, estado: 'suspendido' });
    const useCase = new UpdateOrganizacionUseCase(repository);

    const result = await useCase.execute(1, { estado: 'suspendido' });

    expect(repository.update).toHaveBeenCalledWith(1, { estado: 'suspendido' });
    expect(result.estado).toBe('suspendido');
  });

  it('lanza ZodError con datos incorrectos', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    const useCase = new UpdateOrganizacionUseCase(repository);

    await expect(useCase.execute(1, { email: 'no-email' })).rejects.toBeInstanceOf(ZodError);
  });
});
