/**
 * # Inhabilitar Nino Use Case.spec
 * Propósito: Prueba unitaria Inhabilitar Nino Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = NinoRepository & {
  findById: ReturnType<typeof vi.fn>;
  inhabilitar: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  inhabilitar: vi.fn()
}) as RepoMock;

describe('InhabilitarNinoUseCase', () => {
  it('lanza error si el niño no existe', async () => {
    const repository = makeRepository();
    repository.findById = vi.fn().mockResolvedValue(null);
    const useCase = new InhabilitarNinoUseCase(repository);

    await expect(
      useCase.execute(123, { fecha: new Date(), motivo: 'sin seguimiento' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('delegates la inhabilitación al repositorio', async () => {
    const repository = makeRepository();
    const nino = { id: 123 } as any;
    const payload = { fecha: new Date('2025-01-01'), motivo: 'edad' };
    repository.findById = vi.fn().mockResolvedValue(nino);
    repository.inhabilitar = vi.fn().mockResolvedValue({ ...nino, estado: 'inhabilitado' });
    const useCase = new InhabilitarNinoUseCase(repository);

    const result = await useCase.execute(123, payload);

    expect(repository.inhabilitar).toHaveBeenCalledWith(123, payload);
    expect(result.estado).toBe('inhabilitado');
  });
});
