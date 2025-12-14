/**
 * # Log Activity Use Case
 * Propósito: Caso de uso Log Activity Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # LogActivityUseCase
 *
 * Propósito: registrar actividades/auditoría en el repositorio de logs.
 * Pertenece a: Application layer.
 * Interacciones: `LogRepository`.
 */
import { Injectable } from '@nestjs/common';

import { LogRepository } from '@/application/repositories/LogRepository';
import { LogProps } from '@/domain/entities';

interface LogInput {
  personaId?: number;
  accion: string;
  mensaje: string;
  loggableId?: number;
  loggableType?: string;
  payload?: Record<string, unknown>;
  ip?: string;
  user_agent?: string;
}

@Injectable()
export class LogActivityUseCase {
  constructor(private readonly logRepository: LogRepository) {}

  /**
   * Persiste la actividad con timestamp actual.
   * @param input - datos de actividad a registrar.
   */
  execute(input: LogInput) {
    return this.logRepository.create({
      ...input,
      createdAt: new Date()
    } as never);
  }
}

// No-op logger used as default in unit tests to avoid wiring Nest providers
const noopLogRepository: LogRepository = {
  async create(): Promise<LogProps> {
    const now = new Date();
    return {
      id: 0,
      personaId: undefined,
      accion: 'noop',
      mensaje: null,
      loggableId: 0,
      loggableType: 'noop',
      payload: null,
      ip: null,
      user_agent: null,
      createdAt: now,
      updatedAt: now
    };
  }
};

export const noopLogActivity = new LogActivityUseCase(noopLogRepository);
