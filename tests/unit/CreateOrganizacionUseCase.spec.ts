/**
 * # Create Organizacion Use Case.spec
 * Propósito: Prueba unitaria Create Organizacion Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';

const buildPayload = () => ({
  nombre: 'Fundacion Uno',
  tipo: 'ong',
  estado: 'activo'
});

const makeRepository = () => ({
  create: vi.fn()
}) as Pick<OrganizacionRepository, 'create'> as OrganizacionRepository;

describe('CreateOrganizacionUseCase', () => {
  it('crea organización válida', async () => {
    const repository = makeRepository();
    const useCase = new CreateOrganizacionUseCase(repository);
    const payload = buildPayload();
    repository.create = vi.fn().mockResolvedValue({ ...payload, id: 1 } as any);

    const result = await useCase.execute(payload);

    expect(repository.create).toHaveBeenCalledWith(payload);
    expect(result.id).toBe(1);
  });

  it('lanza ZodError con datos inválidos', () => {
    const repository = makeRepository();
    const useCase = new CreateOrganizacionUseCase(repository);

    expect(() => useCase.execute({ nombre: 'x' })).toThrow(ZodError);
  });
});
