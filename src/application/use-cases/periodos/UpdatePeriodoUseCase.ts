/**
 * # Update Periodo Use Case
 * Propósito: Caso de uso Update Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # UpdatePeriodoUseCase
 *
 * Propósito: actualizar periodos tras validar existencia y DTO; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `updatePeriodoSchema`, `LogActivityUseCase`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { updatePeriodoSchema } from '@/application/dtos/PeriodoDTOs';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class UpdatePeriodoUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, valida DTO y actualiza; registra la actividad.
   * @param id - identificador del periodo.
   * @param data - payload crudo a validar.
   */
  async execute(id: number, data: unknown) {
    const periodo = await this.periodoRepository.findById(id);
    if (!periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }
    const payload = updatePeriodoSchema.parse(data);
    const normalized = normalizeEstadoActivo(
      payload.estado_periodo ?? periodo.estado_periodo,
      payload.es_activo ?? periodo.es_activo
    );
    const mergedPayload = {
      ...payload,
      estado_periodo: normalized.estado_periodo,
      es_activo: normalized.es_activo
    } as typeof payload;

    const overlap = await this.periodoRepository.findOverlapping({
      start: mergedPayload.fecha_inicio ?? periodo.fecha_inicio ?? null,
      end: mergedPayload.fecha_fin ?? periodo.fecha_fin ?? null,
      excludeId: id
    });
    if (overlap) {
      throw new AppError('Ya existe un periodo que se sobrepone en fechas', 409);
    }

    const updated = await this.periodoRepository.update(id, mergedPayload);

    await this.logActivityUseCase.execute({
      accion: 'periodo.actualizado',
      mensaje: 'Se actualizó un periodo',
      loggableType: 'periodo',
      loggableId: id,
      payload
    });

    return updated;
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
