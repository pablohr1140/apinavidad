/**
 * # Activate Periodo Use Case
 * Propósito: Caso de uso Activate Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ActivatePeriodoUseCase
 *
 * Propósito: activar un periodo (marcarlo como activo) y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `AppError`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class ActivatePeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, activa el periodo y registra actividad.
   * @param id - identificador del periodo.
   */
  async execute(id: number) {
    const periodo = await this.periodoRepository.findById(id);
    if (!periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }
    const activated = await this.periodoRepository.activate(id);

    await this.logActivityUseCase.execute({
      accion: 'periodo.activado',
      mensaje: 'Se activó un periodo',
      loggableType: 'periodo',
      loggableId: id
    });

    return activated;
  }
}
