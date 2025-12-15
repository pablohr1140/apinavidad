/**
 * # Update Nino Use Case
 * Propósito: Caso de uso Update Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # UpdateNinoUseCase
 *
 * Propósito: actualizar niños validando existencia y edad máxima; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `updateNinoSchema`, reglas de edad (`calcularEdad`, `MAX_EDAD`), `LogActivityUseCase`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { updateNinoSchema } from '@/application/dtos/NinoDTOs';
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { MAX_EDAD, calcularEdad } from '@/domain/services/ninoRules';
import type { NinoProps } from '@/domain/entities';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class UpdateNinoUseCase {
  constructor(
    private readonly ninoRepository: NinoRepository,
    private readonly periodoRepository: PeriodoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, valida payload, comprueba edad y actualiza; registra auditoría.
   * @param id - identificador del niño.
   * @param data - payload crudo a validar.
   */
  async execute(id: number, data: unknown) {
    const nino = await this.ninoRepository.findById(id);
    if (!nino) {
      throw new AppError('Niño no encontrado', 404);
    }
    const payload = updateNinoSchema.parse(data);

    const documentoNumero =
      payload.documento_numero ??
      (payload.run && payload.dv ? `${payload.run}-${payload.dv}` : payload.run ?? nino.documento_numero ?? null);

    const periodoId = payload.periodoId ?? nino.periodoId;
    const periodo = periodoId ? await this.periodoRepository.findById(periodoId) : null;
    if (periodoId && !periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }

    const fechaReferencia = periodo?.fecha_inicio ?? new Date();
    const fechaNacimiento = payload.fecha_nacimiento ?? nino.fecha_nacimiento ?? undefined;
    const basePayload: Partial<NinoProps> & Record<string, unknown> = {
      ...payload,
      documento_numero: payload.documento_numero ?? undefined
    };

    delete basePayload.run;
    delete basePayload.dv;

    if (documentoNumero) {
      basePayload.documento_numero = documentoNumero;
    } else {
      delete basePayload.documento_numero;
    }
    if (payload.estado === undefined) delete basePayload.estado;
    if (payload.fecha_retiro === undefined) delete basePayload.fecha_retiro;

    const updatePayload: Partial<NinoProps> = { ...basePayload };

    if (fechaNacimiento) {
      const edad = calcularEdad(fechaNacimiento, fechaReferencia);
      if (edad !== null && edad >= MAX_EDAD) {
        updatePayload.estado = 'inhabilitado';
        updatePayload.fecha_retiro = fechaReferencia;
      }
    }

    const updated = await this.ninoRepository.update(id, updatePayload);

    await this.logActivityUseCase.execute({
      personaId: (payload as any).datosDomicilio?.personaId,
      accion: 'nino.actualizado',
      mensaje: '',
      loggableType: 'nino',
      loggableId: id,
      payload
    });

    return updated;
  }
}
