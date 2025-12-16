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
import { AppError } from '@/shared/errors/AppError';

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
    const parsed = createPeriodoSchema.parse(data);

    const { estado_periodo, es_activo } = normalizeEstadoActivo(parsed.estado_periodo, parsed.es_activo);
    const payload = { ...parsed, estado_periodo, es_activo } as typeof parsed;

    return this.periodoRepository
      .findOverlapping({ start: payload.fecha_inicio ?? null, end: payload.fecha_fin ?? null })
      .then((overlap) => {
        if (overlap) {
          throw new AppError('Ya existe un periodo que se sobrepone en fechas', 409);
        }

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
      });
  }
}

function normalizeEstadoActivo(
  estado: 'borrador' | 'planificado' | 'abierto' | 'cerrado',
  activo: boolean
): { estado_periodo: 'borrador' | 'planificado' | 'abierto' | 'cerrado'; es_activo: boolean } {
  let nextEstado = estado;
  let nextActivo = activo;

  if (nextEstado === 'abierto') {
    nextActivo = true;
  } else if (nextActivo) {
    nextEstado = 'abierto';
    nextActivo = true;
  } else {
    nextActivo = false;
  }

  return { estado_periodo: nextEstado, es_activo: nextActivo };
}
