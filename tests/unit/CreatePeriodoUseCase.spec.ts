/**
 * # Create Periodo Use Case.spec
 * Propósito: Prueba unitaria Create Periodo Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';

const buildPayload = () => ({
  nombre: '2025-I',
  fecha_inicio: '2025-03-01',
  fecha_fin: '2025-12-01',
  estado_periodo: 'planificado',
  es_activo: false
});

const makeRepository = () => ({
  create: vi.fn()
}) as Pick<PeriodoRepository, 'create'> as PeriodoRepository;

describe('CreatePeriodoUseCase', () => {
  it('crea periodo válido', async () => {
    const repository = makeRepository();
    repository.create = vi.fn().mockResolvedValue({ id: 1 } as any);
    const useCase = new CreatePeriodoUseCase(repository);

    await useCase.execute(buildPayload());

    expect(repository.create).toHaveBeenCalled();
  });

  it('rechaza payload inválido', () => {
    const repository = makeRepository();
    const useCase = new CreatePeriodoUseCase(repository);

    expect(() => useCase.execute({ nombre: 'x' })).toThrow(ZodError);
  });
});
