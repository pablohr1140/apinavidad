/**
 * # Personas Controller.spec
 * Propósito: Prueba unitaria Personas Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';
import type { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import type { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import type { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';
import type { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
import { PersonasController } from '@/modules/personas/personas.controller';

const mockUseCase = <T>(execute = vi.fn()) => ({ execute }) as unknown as T;

describe('PersonasController', () => {
  let listExecute: ReturnType<typeof vi.fn>;
  let controller: PersonasController;

  beforeEach(() => {
    listExecute = vi.fn();
    controller = new PersonasController(
      { execute: listExecute } as unknown as ListPersonasUseCase,
      mockUseCase<CreatePersonaUseCase>(),
      mockUseCase<GetPersonaUseCase>(),
      mockUseCase<UpdatePersonaUseCase>(),
      mockUseCase<DeletePersonaUseCase>()
    );
  });

  it('convierte el organizacionId a número cuando es válido', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('12', 'john');

    expect(listExecute).toHaveBeenCalledWith({ organizacionId: 12, search: 'john' });
  });

  it('omite organizacionId cuando no es un número', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('abc', undefined);

    expect(listExecute).toHaveBeenCalledWith({ organizacionId: undefined, search: undefined });
  });
});
