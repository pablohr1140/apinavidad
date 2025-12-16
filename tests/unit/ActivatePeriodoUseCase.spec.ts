/**
 * # Activate Periodo Use Case.spec
 * Propósito: Prueba unitaria Activate Periodo Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends PeriodoRepository {
  findById: ReturnType<typeof vi.fn>;
  findOverlapping: ReturnType<typeof vi.fn>;
  activate: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  findOverlapping: vi.fn(),
  activate: vi.fn()
}) as unknown as RepoMock;

describe('ActivatePeriodoUseCase', () => {
  it('lanza AppError cuando no existe el periodo', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new ActivatePeriodoUseCase(repository);

    await expect(useCase.execute(1)).rejects.toBeInstanceOf(AppError);
    expect(repository.activate).not.toHaveBeenCalled();
  });

  it('activa el periodo cuando existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.findOverlapping.mockResolvedValue(null);
    repository.activate.mockResolvedValue({ id: 1, es_activo: true } as any);
    const useCase = new ActivatePeriodoUseCase(repository);

    const result = await useCase.execute(1);

    expect(repository.activate).toHaveBeenCalledWith(1);
    expect(result.es_activo).toBe(true);
  });
});
