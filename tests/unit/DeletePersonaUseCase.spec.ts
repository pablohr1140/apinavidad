/**
 * # Delete Persona Use Case.spec
 * Propósito: Prueba unitaria Delete Persona Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends PersonaRepository {
  findById: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  delete: vi.fn()
}) as unknown as RepoMock;

const makeActor = (rank: number): AuthenticatedUser => ({
  id: 999,
  email: 'actor@example.com',
  roles: [
    {
      id: 1,
      key: 'SUPERADMIN',
      name: 'Superadmin',
      rank
    }
  ],
  permissions: new Set()
});

describe('DeletePersonaUseCase', () => {
  it('lanza error cuando la persona no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new DeletePersonaUseCase(repository);

    await expect(useCase.execute(99, makeActor(400))).rejects.toBeInstanceOf(AppError);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('lanza error cuando el actor no tiene mayor rango', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1, roles: [{ rank: 400 }] } as any);
    const useCase = new DeletePersonaUseCase(repository);

    await expect(useCase.execute(1, makeActor(300))).rejects.toBeInstanceOf(AppError);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('borra la persona cuando existe y el rango es válido', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1, roles: [{ rank: 200 }] } as any);
    repository.delete.mockResolvedValue(undefined);
    const useCase = new DeletePersonaUseCase(repository);

    await useCase.execute(1, makeActor(500));

    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
