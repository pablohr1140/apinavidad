/**
 * # List Ninos Use Case.spec
 * Propósito: Prueba unitaria List Ninos Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect, vi } from 'vitest';

import type { NinoRepository } from '@/application/repositories/NinoRepository';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';

describe('ListNinosUseCase', () => {
  it('pasa los filtros al repository', async () => {
    const repo = {
      findMany: vi.fn().mockResolvedValue([])
    } as unknown as NinoRepository;
    const sut = new ListNinosUseCase(repo);

    await sut.execute({ organizacionId: 1, estado: 'registrado' });

    expect(repo.findMany).toHaveBeenCalledWith({ organizacionId: 1, estado: 'registrado' });
  });
});
