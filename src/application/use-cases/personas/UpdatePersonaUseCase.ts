/**
 * # Update Persona Use Case
 * Propósito: Caso de uso Update Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # UpdatePersonaUseCase
 *
 * Propósito: actualizar personas y sus roles tras validar entrada y existencia; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository`, `updatePersonaSchema`, `LogActivityUseCase`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { updatePersonaSchema } from '@/application/dtos/PersonaDTOs';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class UpdatePersonaUseCase {
  constructor(
    private readonly personaRepository: PersonaRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, valida DTO, actualiza y registra el cambio.
   * @param id - persona objetivo.
   * @param data - payload crudo a validar.
   */
  async execute(id: number, data: unknown) {
    const persona = await this.personaRepository.findById(id);
    if (!persona) {
      throw new AppError('Persona no encontrada', 404);
    }
    const payload = updatePersonaSchema.parse(data);
    const { roles, ...rest } = payload;
    const updated = await this.personaRepository.update(id, { ...rest, roleKeys: roles });

    await this.logActivityUseCase.execute({
      accion: 'persona.actualizada',
      mensaje: 'Se actualizó una persona',
      loggableType: 'persona',
      loggableId: id,
      payload: {
        cambios: rest,
        roles
      }
    });

    return updated;
  }
}
