/**
 * # Restaurar Nino Use Case.spec
 * Propósito: Prueba unitaria Restaurar Nino Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
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

describe('RestaurarNinoUseCase', () => {
  it('restaura un niño existente', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    const restaurado = { id: 1, estado: 'registrado' } as any;
    repository.restaurar.mockResolvedValue(restaurado);
    const useCase = new RestaurarNinoUseCase(repository);

    const result = await useCase.execute(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.restaurar).toHaveBeenCalledWith(1);
    expect(result).toBe(restaurado);
  });

  it('lanza AppError cuando el niño no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new RestaurarNinoUseCase(repository);

    await expect(useCase.execute(999)).rejects.toBeInstanceOf(AppError);
    expect(repository.restaurar).not.toHaveBeenCalled();
  });
});
