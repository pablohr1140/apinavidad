/**
 * # Ninos Controller.spec
 * Propósito: Prueba unitaria Ninos Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import type { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import type { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import type { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import type { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import type { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
import type { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
import { NinosController } from '@/modules/ninos/ninos.controller';

const createUseCase = <T>(execute = vi.fn()) => ({ execute }) as unknown as T;

describe('NinosController', () => {
  let listExecute: ReturnType<typeof vi.fn>;
  let controller: NinosController;

  beforeEach(() => {
    listExecute = vi.fn();
    controller = new NinosController(
      { execute: listExecute } as unknown as ListNinosUseCase,
      createUseCase<CreateNinoUseCase>(),
      createUseCase<GetNinoUseCase>(),
      createUseCase<UpdateNinoUseCase>(),
      createUseCase<InhabilitarNinoUseCase>(),
      createUseCase<RestaurarNinoUseCase>(),
      createUseCase<AutoInhabilitarNinosUseCase>()
    );
  });

  it('convierte los filtros válidos a números', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('10', '20', 'registrado');

    expect(listExecute).toHaveBeenCalledWith({ periodoId: 10, organizacionId: 20, estado: 'registrado' });
  });

  it('ignora filtros inválidos o vacíos en list()', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('NaN', undefined, undefined);

    expect(listExecute).toHaveBeenCalledWith({ periodoId: undefined, organizacionId: undefined, estado: undefined });
  });
});
