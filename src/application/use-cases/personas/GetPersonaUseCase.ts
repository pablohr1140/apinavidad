/**
 * # Get Persona Use Case
 * Propósito: Caso de uso Get Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # GetPersonaUseCase
 *
 * Propósito: obtener una persona por id con manejo de 404.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository` y `AppError` para not found.
 */
import { Injectable } from '@nestjs/common';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class GetPersonaUseCase {
  constructor(private readonly personaRepository: PersonaRepository) {}

  /**
   * Busca una persona por id; lanza 404 si no existe.
   * @param id - identificador de persona.
   */
  async execute(id: number) {
    const persona = await this.personaRepository.findById(id);
    if (!persona) {
      throw new AppError('Persona no encontrada', 404);
    }
    return persona;
  }
}
