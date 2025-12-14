/**
 * # Reportes Controller.spec
 * Propósito: Prueba unitaria Reportes Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { ReportesController } from '@/modules/reportes/reportes.controller';

vi.mock('@/domain/services/ninoRules', () => ({
  MAX_EDAD: 18,
  calcularEdad: vi.fn().mockReturnValue(10)
}));

describe('ReportesController', () => {
  let listExecute: ReturnType<typeof vi.fn>;
  let controller: ReportesController;

  beforeEach(() => {
    listExecute = vi.fn();
    controller = new ReportesController({ execute: listExecute } as unknown as ListNinosUseCase);
  });

  it('lista inhabilitados con total', async () => {
    const sample = [{ id: 1 }];
    listExecute.mockResolvedValue(sample);

    const result = await controller.listInhabilitados();

    expect(listExecute).toHaveBeenCalledWith({ estado: 'inhabilitado' });
    expect(result).toEqual({ total: 1, data: sample });
  });

  it('devuelve datos enriquecidos en listado()', async () => {
    const sample = [
      {
        id: 1,
        fecha_nacimiento: new Date('2015-01-01'),
        other: 'field'
      }
    ];
    listExecute.mockResolvedValue(sample);

    const result = await controller.listado('10', '20', 'registrado');

    expect(listExecute).toHaveBeenCalledWith({ periodoId: 10, organizacionId: 20, estado: 'registrado' });
    expect(result.total).toBe(1);
    expect(result.data[0]).toMatchObject({
      id: 1,
      other: 'field',
      edad_calculada: 10,
      tiempo_para_inhabilitar: 8
    });
  });
});
