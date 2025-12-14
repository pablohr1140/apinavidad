/**
 * # Periodos Controller.spec
 * Propósito: Prueba unitaria Periodos Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import type { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import type { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';
import type { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';
import type { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import type { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
import { PeriodosController } from '@/modules/periodos/periodos.controller';

const mockUseCase = <T>(execute = vi.fn()) => ({ execute }) as unknown as T;

describe('PeriodosController', () => {
  let listExecute: ReturnType<typeof vi.fn>;
  let controller: PeriodosController;

  beforeEach(() => {
    listExecute = vi.fn();
    controller = new PeriodosController(
      { execute: listExecute } as unknown as ListPeriodosUseCase,
      mockUseCase<CreatePeriodoUseCase>(),
      mockUseCase<UpdatePeriodoUseCase>(),
      mockUseCase<OpenPeriodoUseCase>(),
      mockUseCase<ClosePeriodoUseCase>(),
      mockUseCase<ActivatePeriodoUseCase>()
    );
  });

  it('interpreta los filtros opcionales correctamente', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('abierto', true);

    expect(listExecute).toHaveBeenCalledWith({ estado: 'abierto', activo: true });
  });

  it('deja activo como undefined cuando no llega', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list(undefined, undefined);

    expect(listExecute).toHaveBeenCalledWith({ estado: undefined, activo: undefined });
  });
});
