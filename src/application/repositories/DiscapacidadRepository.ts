/**
 * # Discapacidad Repository
 * Propósito: Contrato de repositorio Discapacidad Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */

/**
 * # DiscapacidadRepository
 *
 * Propósito: contrato de persistencia para discapacidades/catalogo de condiciones.
 * Pertenece a: Application layer.
 * Interacciones: `DiscapacidadProps`.
 */
import { DiscapacidadProps } from '@/domain/entities';

export abstract class DiscapacidadRepository {
  /** Lista discapacidades con filtro por estado activo. */
  abstract findMany(params?: { activo?: boolean }): Promise<DiscapacidadProps[]>;
  /** Crea una discapacidad. */
  abstract create(data: Omit<DiscapacidadProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscapacidadProps>;
}
