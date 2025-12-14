/**
 * # Organizaciones Controller.spec
 * Propósito: Prueba unitaria Organizaciones Controller.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, beforeEach, expect, vi } from 'vitest';

import type { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import type { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import type { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import type { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import type { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { OrganizacionesController } from '@/modules/organizaciones/organizaciones.controller';

const mockUseCase = <T>(execute = vi.fn()) => ({ execute }) as unknown as T;

describe('OrganizacionesController', () => {
  let listExecute: ReturnType<typeof vi.fn>;
  let getExecute: ReturnType<typeof vi.fn>;
  let controller: OrganizacionesController;

  beforeEach(() => {
    listExecute = vi.fn();
    getExecute = vi.fn();
    controller = new OrganizacionesController(
      { execute: listExecute } as unknown as ListOrganizacionesUseCase,
      mockUseCase<CreateOrganizacionUseCase>(),
      { execute: getExecute } as unknown as GetOrganizacionUseCase,
      mockUseCase<UpdateOrganizacionUseCase>(),
      mockUseCase<DeleteOrganizacionUseCase>()
    );
  });

  it('omite filtros vacíos en list()', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list(undefined, '');

    expect(listExecute).toHaveBeenCalledWith({ estado: undefined, tipo: undefined });
  });

  it('envía los filtros cuando se proporcionan', async () => {
    listExecute.mockResolvedValue([]);

    await controller.list('activo', 'fundacion');

    expect(listExecute).toHaveBeenCalledWith({ estado: 'activo', tipo: 'fundacion' });
  });

  it('delegates getOne al caso de uso', async () => {
    const organizacion = { id: 2 } as any;
    getExecute.mockResolvedValue(organizacion);

    const result = await controller.getOne(2);

    expect(getExecute).toHaveBeenCalledWith(2);
    expect(result).toBe(organizacion);
  });
});
