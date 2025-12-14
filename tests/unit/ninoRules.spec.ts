/**
 * # nino Rules.spec
 * Propósito: Prueba unitaria nino Rules.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it } from 'vitest';

import { calcularEdad, debeInhabilitar, prepararInhabilitacion } from '@/domain/services/ninoRules';

describe('ninoRules', () => {
  it('calcula edad correctamente', () => {
    const edad = calcularEdad(new Date('2018-01-01'), new Date('2025-01-01'));
    expect(edad).toBe(7);
  });

  it('detecta si debe inhabilitar', () => {
    const inhabilitar = debeInhabilitar({
      fecha_nacimiento: new Date('2013-01-01')
    } as any);
    expect(inhabilitar).toBe(true);
  });

  it('prepara la inhabilitación con la fecha adecuada', () => {
    const referencia = new Date('2025-02-01');
    const nino = {
      fecha_nacimiento: new Date('2016-01-01'),
      fecha_ingreso: new Date('2025-03-01')
    } as any;

    const resultado = prepararInhabilitacion(nino, referencia);

    expect(resultado).toEqual({
      estado: 'inhabilitado',
      fecha_retiro: nino.fecha_ingreso
    });
  });

  it('usa la fecha de referencia cuando el ingreso es anterior', () => {
    const referencia = new Date('2025-02-01');
    const nino = {
      fecha_nacimiento: new Date('2016-01-01'),
      fecha_ingreso: new Date('2024-12-01')
    } as any;

    const resultado = prepararInhabilitacion(nino, referencia);

    expect(resultado.fecha_retiro).toEqual(referencia);
  });
});
