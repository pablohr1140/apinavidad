/**
 * # Delete Persona Use Case
 * Propósito: Caso de uso Delete Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # DeletePersonaUseCase
 *
 * Propósito: eliminar personas aplicando validación de jerarquía de roles y registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository`, `AuthenticatedUser`, `LogActivityUseCase`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class DeletePersonaUseCase {
  constructor(
    private readonly personaRepository: PersonaRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida existencia y jerarquía de roles antes de eliminar; registra auditoría con el actor.
   * @param id - persona a eliminar.
   * @param actor - usuario autenticado que ejecuta la acción.
   */
  async execute(id: number, actor: AuthenticatedUser) {
    const persona = await this.personaRepository.findById(id);
    if (!persona) {
      throw new AppError('Persona no encontrada', 404);
    }

    const actorRank = this.getHighestRank(actor.roles);
    const targetRank = this.getHighestRank(persona.roles);

    if (actorRank <= targetRank) {
      throw new AppError('No tienes permisos para eliminar esta persona', 403);
    }

    await this.personaRepository.delete(id);

    await this.logActivityUseCase.execute({
      personaId: actor.id,
      accion: 'persona.eliminada',
      mensaje: 'Se eliminó una persona',
      loggableType: 'persona',
      loggableId: id,
      payload: {
        actorId: actor.id,
        actorRoles: actor.roles.map((role) => role.key)
      }
    });
  }

  private getHighestRank(roles: Array<{ rank: number }>) {
    if (!roles.length) {
      return 0;
    }
    return Math.max(...roles.map((role) => role.rank));
  }
}
