/**
 * # Get Persona Use Case.spec
 * Propósito: Prueba unitaria Get Persona Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = PersonaRepository & {
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

describe('GetPersonaUseCase', () => {
  it('retorna la persona encontrada', async () => {
    const repository = makeRepository();
    const persona = { id: 1, nombres: 'Carlos' } as any;
    repository.findById.mockResolvedValue(persona);
    const useCase = new GetPersonaUseCase(repository);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(persona);
  });

  it('lanza AppError cuando no existe la persona', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new GetPersonaUseCase(repository);

    await expect(useCase.execute(55)).rejects.toBeInstanceOf(AppError);
  });
});
