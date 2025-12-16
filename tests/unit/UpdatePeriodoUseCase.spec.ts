/**
 * # Update Periodo Use Case.spec
 * Propósito: Prueba unitaria Update Periodo Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends PeriodoRepository {
  findById: ReturnType<typeof vi.fn>;
  findOverlapping: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  findOverlapping: vi.fn(),
  update: vi.fn()
}) as unknown as RepoMock;

describe('UpdatePeriodoUseCase', () => {
  it('lanza AppError cuando no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new UpdatePeriodoUseCase(repository);

    await expect(useCase.execute(1, {})).rejects.toBeInstanceOf(AppError);
  });

  it('actualiza el periodo', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1, fecha_inicio: null, fecha_fin: null } as any);
    repository.findOverlapping.mockResolvedValue(null);
    repository.update.mockResolvedValue({ id: 1, nombre: 'Nuevo' });
    const useCase = new UpdatePeriodoUseCase(repository);

    const result = await useCase.execute(1, { nombre: 'Nuevo' });

    expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: 'Nuevo' }));
    expect(result.nombre).toBe('Nuevo');
  });

  it('lanza ZodError si payload inválido', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    const useCase = new UpdatePeriodoUseCase(repository);

    await expect(useCase.execute(1, { fecha_fin: 'no-date' })).rejects.toBeInstanceOf(ZodError);
  });
});
