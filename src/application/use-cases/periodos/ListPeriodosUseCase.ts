/**
 * # List Periodos Use Case
 * Propósito: Caso de uso List Periodos Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ListPeriodosUseCase
 *
 * Propósito: listar periodos con filtros opcionales (estado, activo).
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`.
 */
import { Injectable } from '@nestjs/common';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';

@Injectable()
export class ListPeriodosUseCase {
  constructor(private readonly periodoRepository: PeriodoRepository) {}

  /**
   * Delegación de filtros al repositorio para obtener periodos.
   * @param params - filtros opcionales.
   */
  execute(params?: Parameters<PeriodoRepository['findMany']>[0]) {
    return this.periodoRepository.findMany(params);
  }
}
