/**
 * # Update Nino Use Case.spec
 * Propósito: Prueba unitaria Update Nino Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
import * as ninoRules from '@/domain/services/ninoRules';
import { AppError } from '@/shared/errors/AppError';

type RepoMock = NinoRepository & {
  findMany: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  inhabilitar: ReturnType<typeof vi.fn>;
  restaurar: ReturnType<typeof vi.fn>;
  autoInhabilitar: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock => ({
  findMany: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  inhabilitar: vi.fn(),
  restaurar: vi.fn(),
  autoInhabilitar: vi.fn()
}) as unknown as RepoMock;

const makePeriodoRepository = () => ({
  findById: vi.fn()
}) as Pick<PeriodoRepository, 'findById'> as PeriodoRepository;

describe('UpdateNinoUseCase', () => {
  it('lanza AppError si el niño no existe', async () => {
    const repository = makeRepository();
    const periodoRepository = makePeriodoRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new UpdateNinoUseCase(repository, periodoRepository);

    await expect(useCase.execute(1, {})).rejects.toBeInstanceOf(AppError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('bloquea la actualización si la nueva edad supera el máximo', async () => {
    const repository = makeRepository();
    const periodoRepository = makePeriodoRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    periodoRepository.findById.mockResolvedValue({ id: 1, fecha_inicio: new Date('2024-03-01') } as any);
    const useCase = new UpdateNinoUseCase(repository, periodoRepository);
    const calcularEdadSpy = vi.spyOn(ninoRules, 'calcularEdad');
    calcularEdadSpy.mockReturnValueOnce(ninoRules.MAX_EDAD + 1);

    await useCase.execute(1, { fecha_nacimiento: new Date('2000-01-01') });

    expect(repository.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ estado: 'inhabilitado', fecha_retiro: expect.any(Date) })
    );
  });

  it('actualiza al niño con payload válido', async () => {
    const repository = makeRepository();
    const periodoRepository = makePeriodoRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue({ id: 1, nombres: 'Pedro' } as any);
    periodoRepository.findById.mockResolvedValue({ id: 1, fecha_inicio: new Date('2024-03-01') } as any);
    const useCase = new UpdateNinoUseCase(repository, periodoRepository);

    const resultado = await useCase.execute(1, { nombres: 'Pedro' });

    expect(repository.update).toHaveBeenCalledWith(1, { nombres: 'Pedro' });
    expect(resultado.nombres).toBe('Pedro');
  });
});
