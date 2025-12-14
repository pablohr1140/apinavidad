/**
 * # Auto Inhabilitar Ninos Use Case
 * Propósito: Caso de uso Auto Inhabilitar Ninos Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # AutoInhabilitarNinosUseCase
 *
 * Propósito: inhabilitar en lote a los niños que superan la edad máxima, con opción dry-run y auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository` (autoInhabilitar), `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';

interface Params {
  fechaReferencia?: Date;
  dryRun?: boolean;
}

@Injectable()
export class AutoInhabilitarNinosUseCase {
  constructor(
    private readonly ninoRepository: NinoRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Ejecuta la auto-inhabilitación (o dry-run) y registra el resultado.
   * @param fechaReferencia - fecha a usar para calcular edad.
   * @param dryRun - si es true, solo reporta sin persistir cambios.
   */
  async execute({ fechaReferencia = new Date(), dryRun }: Params) {
    const result = await this.ninoRepository.autoInhabilitar(fechaReferencia, dryRun);

    await this.logActivityUseCase.execute({
      accion: dryRun ? 'nino.autoinhabilitar.dryrun' : 'nino.autoinhabilitar',
      mensaje: 'Auto inhabilitación de niños',
      loggableType: 'nino.bulk',
      loggableId: 0,
      payload: {
        fechaReferencia,
        dryRun: !!dryRun,
        afectados: result.afectados
      }
    });

    return result;
  }
}
