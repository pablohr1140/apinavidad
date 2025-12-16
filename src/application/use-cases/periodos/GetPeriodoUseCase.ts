/**
 * # Get Periodo Use Case
 * Prop3sito: Caso de uso Get Periodo Use Case
 * Pertenece a: Aplicacibn / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # GetPeriodoUseCase
 *
 * Propbc3sito: obtener un periodo por id con manejo de 404.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository` y `AppError` para not found.
 */
import { Injectable } from '@nestjs/common';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class GetPeriodoUseCase {
  constructor(private readonly periodoRepository: PeriodoRepository) {}

  /**
   * Busca un periodo por id; lanza 404 si no existe.
   * @param id - identificador del periodo.
   */
  async execute(id: number) {
    const periodo = await this.periodoRepository.findById(id);
    if (!periodo) {
      throw new AppError('Periodo no encontrado', 404);
    }
    return periodo;
  }
}
