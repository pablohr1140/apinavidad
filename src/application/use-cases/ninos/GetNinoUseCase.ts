/**
 * # Get Nino Use Case
 * Propósito: Caso de uso Get Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # GetNinoUseCase
 *
 * Propósito: obtener un niño por id, retornando 404 si no existe.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class GetNinoUseCase {
  constructor(private readonly ninoRepository: NinoRepository) {}

  /**
   * Busca un niño por id y lanza `AppError` 404 si no se encuentra.
   * @param id - identificador del niño.
   */
  async execute(id: number) {
    const nino = await this.ninoRepository.findById(id);
    if (!nino) {
      throw new AppError('Niño no encontrado', 404);
    }
    return nino;
  }
}
