/**
 * # App Error.spec
 * Propósito: Prueba unitaria App Error.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it } from 'vitest';

import { AppError } from '@/shared/errors/AppError';

describe('AppError', () => {
  it('usa 400 como estado por defecto', () => {
    const error = new AppError('algo salió mal');
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('algo salió mal');
  });

  it('permite definir status y metadata', () => {
    const metadata = { recurso: 'nino' };
    const error = new AppError('no encontrado', 404, metadata);
    expect(error.statusCode).toBe(404);
    expect(error.metadata).toEqual(metadata);
  });
});
