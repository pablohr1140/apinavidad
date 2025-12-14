/**
 * # Get Nino Use Case.spec
 * Propósito: Prueba unitaria Get Nino Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = NinoRepository & {
  findMany: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  inhabilitar: ReturnType<typeof vi.fn>;
  restaurar: ReturnType<typeof vi.fn>;
  autoInhabilitar: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock => ({
  findMany: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  inhabilitar: vi.fn(),
  restaurar: vi.fn(),
  autoInhabilitar: vi.fn()
}) as unknown as RepoMock;

describe('GetNinoUseCase', () => {
  it('retorna al niño encontrado', async () => {
    const repository = makeRepository();
    const nino = { id: 1, nombres: 'Ana' } as any;
    repository.findById.mockResolvedValue(nino);
    const useCase = new GetNinoUseCase(repository);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(nino);
  });

  it('lanza AppError cuando no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new GetNinoUseCase(repository);

    await expect(useCase.execute(99)).rejects.toBeInstanceOf(AppError);
  });
});
