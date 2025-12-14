/**
 * # Close Periodo Use Case
 * Propósito: Caso de uso Close Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ClosePeriodoUseCase
 *
 * Propósito: cerrar un periodo existente y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `AppError`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class ClosePeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida existencia, cierra el periodo y registra la acción.
   * @param id - identificador del periodo.
   */
  async execute(id: number) {
    const periodo = await this.periodoRepository.findById(id);
    if (!periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }
    const closed = await this.periodoRepository.close(id);

    await this.logActivityUseCase.execute({
      accion: 'periodo.cerrado',
      mensaje: 'Se cerró un periodo',
      loggableType: 'periodo',
      loggableId: id
    });

    return closed;
  }
}
