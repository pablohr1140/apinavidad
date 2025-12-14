/**
 * # Inhabilitar Nino Use Case
 * Propósito: Caso de uso Inhabilitar Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # InhabilitarNinoUseCase
 *
 * Propósito: inhabilitar un niño con motivo/fecha, registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError` para 404, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

interface Payload {
  fecha: Date;
  motivo: string;
  personaId?: number;
}

@Injectable()
export class InhabilitarNinoUseCase {
  constructor(
    private readonly ninoRepository: NinoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, delega inhabilitación con motivo/fecha y registra auditoría.
   * @param id - identificador del niño.
   * @param payload - datos de inhabilitación (fecha, motivo, personaId opcional).
   */
  async execute(id: number, payload: Payload) {
    const nino = await this.ninoRepository.findById(id);
    if (!nino) {
      throw new AppError('Niño no encontrado', 404);
    }
    const updated = await this.ninoRepository.inhabilitar(id, payload);

    await this.logActivityUseCase.execute({
      personaId: payload.personaId,
      accion: 'nino.inhabilitado',
      mensaje: payload.motivo,
      loggableType: 'nino',
      loggableId: id,
      payload: { ...payload }
    });

    return updated;
  }
}
