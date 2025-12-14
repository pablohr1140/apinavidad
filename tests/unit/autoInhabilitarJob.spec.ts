/**
 * # auto Inhabilitar Job.spec
 * Propósito: Prueba unitaria auto Inhabilitar Job.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { NestFactory } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nestjs/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@nestjs/core')>();
  return {
    ...actual,
    NestFactory: {
      createApplicationContext: vi.fn()
    }
  };
});

vi.mock('@/shared/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { runAutoInhabilitarJob } from '@/infra/jobs/autoInhabilitarJob';
import { logger } from '@/shared/logger';

describe('autoInhabilitarJob', () => {
  it('ejecuta el use case y registra el resultado', async () => {
    const execute = vi.fn().mockResolvedValue({ afectados: 2 });
    const close = vi.fn().mockResolvedValue(undefined);
    const get = vi.fn().mockReturnValue({ execute });
    (NestFactory.createApplicationContext as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ get, close });

    await runAutoInhabilitarJob();

    expect(get).toHaveBeenCalledWith(AutoInhabilitarNinosUseCase);
    expect(execute).toHaveBeenCalledWith({});
    expect(logger.info).toHaveBeenCalledWith({ afectados: 2 }, 'Auto inhabilitacion ejecutada');
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('cierra el contexto incluso ante errores', async () => {
    const execute = vi.fn().mockRejectedValue(new Error('fail'));
    const close = vi.fn().mockResolvedValue(undefined);
    const get = vi.fn().mockReturnValue({ execute });
    (NestFactory.createApplicationContext as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ get, close });

    await expect(runAutoInhabilitarJob()).rejects.toThrow('fail');
    expect(close).toHaveBeenCalledTimes(1);
  });
});
