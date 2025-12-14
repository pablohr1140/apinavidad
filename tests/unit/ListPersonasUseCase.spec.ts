/**
 * # List Personas Use Case.spec
 * Propósito: Prueba unitaria List Personas Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';

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

describe('ListPersonasUseCase', () => {
  it('delegates in repository with filters', async () => {
    const repository = makeRepository();
    const personas = [{ id: 1 } as any];
    repository.findMany.mockResolvedValue(personas);
    const useCase = new ListPersonasUseCase(repository);
    const filters = { organizacionId: 3, search: 'ana' };

    const result = await useCase.execute(filters);

    expect(repository.findMany).toHaveBeenCalledWith(filters);
    expect(result).toBe(personas);
  });

  it('usa parámetros opcionales cuando no hay filtros', async () => {
    const repository = makeRepository();
    repository.findMany.mockResolvedValue([]);
    const useCase = new ListPersonasUseCase(repository);

    const result = await useCase.execute();

    expect(repository.findMany).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([]);
  });
});
