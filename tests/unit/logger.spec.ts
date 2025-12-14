/**
 * # logger.spec
 * Propósito: Prueba unitaria logger.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect } from 'vitest';

import { buildLoggerOptions } from '@/shared/logger';

describe('buildLoggerOptions', () => {
  it('habilita pino-pretty en desarrollo', () => {
    const options = buildLoggerOptions({ level: 'debug', nodeEnv: 'development' });

    expect(options.level).toBe('debug');
    expect(options.transport).toEqual(
      expect.objectContaining({
        target: 'pino-pretty'
      })
    );
  });

  it('omite transport fuera de desarrollo', () => {
    const options = buildLoggerOptions({ level: 'info', nodeEnv: 'production' });

    expect(options.level).toBe('info');
    expect(options.transport).toBeUndefined();
  });
});
