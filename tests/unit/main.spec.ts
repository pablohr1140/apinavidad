/**
 * # main.spec
 * Propósito: Prueba unitaria main.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';

import { AppModule } from '../../src/app.module';
import { env } from '../../src/config/env';
import { bootstrap } from '../../src/main';

const mocks = vi.hoisted(() => ({
  helmetMock: vi.fn(() => 'helmet-middleware'),
  createMock: vi.fn(),
}));

vi.mock('helmet', () => ({
  default: mocks.helmetMock,
}));

vi.mock('@nestjs/core', async () => {
  const actual = await vi.importActual<typeof import('@nestjs/core')>('@nestjs/core');
  return {
    ...actual,
    NestFactory: {
      create: mocks.createMock,
    },
  };
});

const { helmetMock, createMock } = mocks;

describe('bootstrap', () => {
  it('configura la app Nest', async () => {
    const enableCors = vi.fn();
    const use = vi.fn();
    const listen = vi.fn();

    createMock.mockResolvedValueOnce({
      enableCors,
      use,
      listen,
    });

    await bootstrap();

    expect(createMock).toHaveBeenCalledWith(AppModule);
    expect(enableCors).toHaveBeenCalledTimes(1);
    expect(helmetMock).toHaveBeenCalledTimes(1);
    expect(use).toHaveBeenCalledWith('helmet-middleware');
    expect(listen).toHaveBeenCalledWith(env.PORT);
  });
});
