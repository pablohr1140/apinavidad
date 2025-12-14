/**
 * # Log Activity Use Case.spec
 * Propósito: Prueba unitaria Log Activity Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { LogRepository } from '@/application/repositories/LogRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';

describe('LogActivityUseCase', () => {
  it('crea un log con fecha actual', async () => {
    const create = vi.fn().mockImplementation((payload) => payload);
    const repository = { create } as unknown as LogRepository;
    const useCase = new LogActivityUseCase(repository);

    const now = new Date('2025-01-01T00:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const log = await useCase.execute({ accion: 'LOGIN', mensaje: 'Usuario autenticado' });

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ accion: 'LOGIN', createdAt: now }));
    expect(log.createdAt).toEqual(now);

    vi.useRealTimers();
  });
});
