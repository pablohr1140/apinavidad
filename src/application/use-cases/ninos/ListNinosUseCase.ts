/**
 * # List Ninos Use Case
 * Propósito: Caso de uso List Ninos Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ListNinosUseCase
 *
 * Propósito: listar niños con filtros (organización, periodo, estado, edad/prioridad).
 * Pertenece a: Application layer.
 * Interacciones: depende de `NinoRepository` (Prisma).
 */
import { Injectable } from '@nestjs/common';

import { NinoRepository } from '@/application/repositories/NinoRepository';

@Injectable()
export class ListNinosUseCase {
  constructor(private readonly ninoRepository: NinoRepository) {}

  /**
   * Delegación de búsqueda al repositorio con filtros opcionales.
   * @param params - filtros permitidos por `findMany`.
   */
  execute(params?: Parameters<NinoRepository['findMany']>[0]) {
    return this.ninoRepository.findMany(params);
  }
}
