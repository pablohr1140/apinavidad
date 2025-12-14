/**
 * # Auto Inhabilitar Ninos Use Case.spec
 * Propósito: Prueba unitaria Auto Inhabilitar Ninos Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect, vi } from 'vitest';

import type { NinoRepository } from '@/application/repositories/NinoRepository';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';

describe('AutoInhabilitarNinosUseCase', () => {
  it('usa fecha por defecto cuando no se envía', async () => {
    const repo = {
      autoInhabilitar: vi.fn().mockResolvedValue({ afectados: 0 })
    } as unknown as NinoRepository;
    const sut = new AutoInhabilitarNinosUseCase(repo);

    await sut.execute({});

    expect(repo.autoInhabilitar).toHaveBeenCalled();
    const [fecha, dryRun] = repo.autoInhabilitar.mock.calls[0];
    expect(fecha).toBeInstanceOf(Date);
    expect(dryRun).toBeUndefined();
  });

  it('envía los parámetros recibidos', async () => {
    const repo = {
      autoInhabilitar: vi.fn().mockResolvedValue({ afectados: 2 })
    } as unknown as NinoRepository;
    const sut = new AutoInhabilitarNinosUseCase(repo);

    const fechaReferencia = new Date('2025-01-01');
    await sut.execute({ fechaReferencia, dryRun: true });

    expect(repo.autoInhabilitar).toHaveBeenCalledWith(fechaReferencia, true);
  });
});
