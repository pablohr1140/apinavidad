/**
 * # Periodo Status Use Cases.spec
 * Propósito: Prueba unitaria Periodo Status Use Cases.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect, vi } from 'vitest';

import type { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = PeriodoRepository & {
  findById: ReturnType<typeof vi.fn>;
  open: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  activate: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock =>
  ({
    findById: vi.fn(),
    open: vi.fn(),
    close: vi.fn(),
    activate: vi.fn()
  } as unknown as RepoMock);

describe('Cambio de estado de periodos', () => {
  it('OpenPeriodoUseCase lanza error si no existe', async () => {
    const repo = makeRepository();
    repo.findById.mockResolvedValue(null);
    const sut = new OpenPeriodoUseCase(repo);

    await expect(() => sut.execute(1)).rejects.toBeInstanceOf(AppError);
    expect(repo.open).not.toHaveBeenCalled();
  });

  it('OpenPeriodoUseCase delega en el repositorio', async () => {
    const repo = makeRepository();
    repo.findById.mockResolvedValue({ id: 1 });
    repo.open.mockResolvedValue({ id: 1, estado: 'abierto' });
    const sut = new OpenPeriodoUseCase(repo);

    await sut.execute(1);

    expect(repo.open).toHaveBeenCalledWith(1);
  });

  it('ClosePeriodoUseCase cubre rama feliz', async () => {
    const repo = makeRepository();
    repo.findById.mockResolvedValue({ id: 1 });
    repo.close.mockResolvedValue({ id: 1, estado: 'cerrado' });
    const sut = new ClosePeriodoUseCase(repo);

    await sut.execute(1);

    expect(repo.close).toHaveBeenCalledWith(1);
  });

  it('ActivatePeriodoUseCase valida existencia', async () => {
    const repo = makeRepository();
    repo.findById.mockResolvedValue(null);
    const sut = new ActivatePeriodoUseCase(repo);

    await expect(() => sut.execute(2)).rejects.toBeInstanceOf(AppError);
  });
});
