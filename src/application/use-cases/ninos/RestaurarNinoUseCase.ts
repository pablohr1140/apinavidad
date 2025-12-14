/**
 * # Restaurar Nino Use Case
 * Propósito: Caso de uso Restaurar Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # RestaurarNinoUseCase
 *
 * Propósito: restaurar un niño inhabilitado y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError` para 404, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class RestaurarNinoUseCase {
  constructor(
    private readonly ninoRepository: NinoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, restaura el estado y registra el evento.
   * @param id - identificador del niño.
   * @param personaId - actor opcional para la auditoría.
   */
  async execute(id: number, personaId?: number) {
    const nino = await this.ninoRepository.findById(id);
    if (!nino) {
      throw new AppError('Niño no encontrado', 404);
    }
    const restored = await this.ninoRepository.restaurar(id);

    await this.logActivityUseCase.execute({
      personaId,
      accion: 'nino.restaurado',
      mensaje: '',
      loggableType: 'nino',
      loggableId: id,
      payload: { nino }
    });

    return restored;
  }
}
