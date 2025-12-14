/**
 * # Open Periodo Use Case
 * Propósito: Caso de uso Open Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # OpenPeriodoUseCase
 *
 * Propósito: abrir un periodo existente y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `AppError`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class OpenPeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, abre el periodo y registra la acción.
   * @param id - identificador de periodo.
   */
  async execute(id: number) {
    const periodo = await this.periodoRepository.findById(id);
    if (!periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }
    const opened = await this.periodoRepository.open(id);

    await this.logActivityUseCase.execute({
      accion: 'periodo.abierto',
      mensaje: 'Se abrió un periodo',
      loggableType: 'periodo',
      loggableId: id
    });

    return opened;
  }
}
