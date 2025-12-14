/**
 * # Create Persona Use Case
 * Propósito: Caso de uso Create Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # CreatePersonaUseCase
 *
 * Propósito: crear personas, asignar roles y registrar actividad.
 * Pertenece a: Application layer.
 * Interacciones: `createPersonaSchema`, `PersonaRepository`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { createPersonaSchema } from '@/application/dtos/PersonaDTOs';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';

@Injectable()
export class CreatePersonaUseCase {
  constructor(
    private readonly personaRepository: PersonaRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida el DTO, crea la persona con roles y registra auditoría.
   * @param data - entrada cruda a validar.
   * @returns persona creada.
   */
  execute(data: unknown) {
    const payload = createPersonaSchema.parse(data);
    const { roles = [], ...persona } = payload;
    const now = new Date();

    return this.personaRepository
      .create({
        ...persona,
        createdAt: now,
        updatedAt: now,
        roleKeys: roles
      })
      .then((created) => {
        void this.logActivityUseCase.execute({
          accion: 'persona.creada',
          mensaje: 'Se creó una persona',
          loggableType: 'persona',
          loggableId: created.id,
          payload: {
            nombres: created.nombres,
            apellidos: created.apellidos,
            email: created.email
          }
        });

        return created;
      });
  }
}
