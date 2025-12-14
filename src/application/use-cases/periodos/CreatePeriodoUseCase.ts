/**
 * # Create Periodo Use Case
 * Propósito: Caso de uso Create Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # CreatePeriodoUseCase
 *
 * Propósito: crear periodos validando DTO y registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `createPeriodoSchema`, `PeriodoRepository`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { createPeriodoSchema } from '@/application/dtos/PeriodoDTOs';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';

@Injectable()
export class CreatePeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida el DTO, crea el periodo y registra actividad.
   * @param data - payload crudo a validar.
   */
  execute(data: unknown) {
    const payload = createPeriodoSchema.parse(data);
    return this.periodoRepository.create(payload as never).then((created) => {
      void this.logActivityUseCase.execute({
        accion: 'periodo.creado',
        mensaje: 'Se creó un periodo',
        loggableType: 'periodo',
        loggableId: created.id,
        payload: {
          nombre: created.nombre,
          estado_periodo: created.estado_periodo
        }
      });

      return created;
    });
  }
}
