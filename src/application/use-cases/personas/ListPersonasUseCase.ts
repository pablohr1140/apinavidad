/**
 * # List Personas Use Case
 * Propósito: Caso de uso List Personas Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ListPersonasUseCase
 *
 * Propósito: listar personas con filtros opcionales (organización, búsqueda).
 * Pertenece a: Application layer.
 * Interacciones: depende de `PersonaRepository` (Prisma).
 */
import { Injectable } from '@nestjs/common';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';

@Injectable()
export class ListPersonasUseCase {
  constructor(private readonly personaRepository: PersonaRepository) {}

  /**
   * Delegación de filtros al repositorio para obtener personas.
   * @param params - filtros permitidos por el repositorio.
   */
  execute(params?: Parameters<PersonaRepository['findMany']>[0]) {
    return this.personaRepository.findMany(params);
  }
}
