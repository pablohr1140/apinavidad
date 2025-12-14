/**
 * # nino Rules
 * Propósito: Dominio nino Rules
 * Pertenece a: Dominio
 * Interacciones: Entidades, reglas de negocio
 */

import { differenceInYears, isBefore } from 'date-fns';

import { NinoProps } from '@/domain/entities';

export const MAX_EDAD = 10;

export function calcularEdad(fechaNacimiento?: Date | null, fechaReferencia = new Date()): number | null {
  if (!fechaNacimiento) {
    return null;
  }
  return differenceInYears(fechaReferencia, fechaNacimiento);
}

export function debeInhabilitar(nino: NinoProps, fechaReferencia = new Date()): boolean {
  const edad = calcularEdad(nino.fecha_nacimiento, fechaReferencia);
  return edad !== null && edad >= MAX_EDAD;
}

export function prepararInhabilitacion(
  nino: NinoProps,
  fechaReferencia = new Date()
): Pick<NinoProps, 'estado' | 'fecha_retiro'> {
  const ingreso = nino.fecha_ingreso ?? fechaReferencia;
  const fechaRetiro = isBefore(ingreso, fechaReferencia) ? fechaReferencia : ingreso;
  return {
    estado: false,
    fecha_retiro: fechaRetiro
  };
}
