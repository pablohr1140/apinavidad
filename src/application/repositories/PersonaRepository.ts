/**
 * # Persona Repository
 * Propósito: Contrato de repositorio Persona Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */

/* istanbul ignore file */
/**
 * # PersonaRepository
 *
 * Propósito: contrato de persistencia para personas (lectura/escritura y roles asociados).
 * Pertenece a: Application layer.
 * Interacciones: `PersonaProps`, `RoleKey`; usado por casos de uso de personas y auth.
 */
import type { RoleKey } from '@/domain/access-control';
import { PersonaProps } from '@/domain/entities';

type PersonaData = Omit<PersonaProps, 'id' | 'roles'>;

export interface PersonaCreateInput extends PersonaData {
  roleKeys?: RoleKey[];
  roleId?: number | null;
}

export interface PersonaUpdateInput extends Partial<PersonaData> {
  roleKeys?: RoleKey[];
  roleId?: number | null;
}

export abstract class PersonaRepository {
  /** Lista personas con filtros opcionales. */
  abstract findMany(params?: { organizacionId?: number; search?: string }): Promise<PersonaProps[]>;
  /** Busca una persona por id. */
  abstract findById(id: number): Promise<PersonaProps | null>;
  /** Crea una nueva persona con asignación de roles opcional. */
  abstract create(data: PersonaCreateInput): Promise<PersonaProps>;
  /** Actualiza datos de persona y roles. */
  abstract update(id: number, data: PersonaUpdateInput): Promise<PersonaProps>;
  /** Elimina lógicamente/definitivamente una persona (según implementación). */
  abstract delete(id: number): Promise<void>;
}
