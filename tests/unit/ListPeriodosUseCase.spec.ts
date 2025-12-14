/**
 * # List Periodos Use Case.spec
 * Propósito: Prueba unitaria List Periodos Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';

const makeRepository = () => ({
  findMany: vi.fn()
}) as Pick<PeriodoRepository, 'findMany'> as PeriodoRepository;

describe('ListPeriodosUseCase', () => {
  it('delegates en el repositorio con filtros', async () => {
    const repository = makeRepository();
    repository.findMany = vi.fn().mockResolvedValue([]);
    const useCase = new ListPeriodosUseCase(repository);

    await useCase.execute({ estado: 'abierto', activo: true });

    expect(repository.findMany).toHaveBeenCalledWith({ estado: 'abierto', activo: true });
  });
});
