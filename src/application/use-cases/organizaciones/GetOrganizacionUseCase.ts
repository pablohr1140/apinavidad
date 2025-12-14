/**
 * # Get Organizacion Use Case
 * Propósito: Caso de uso Get Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # GetOrganizacionUseCase
 *
 * Propósito: obtener una organización por id, validando existencia.
 * Pertenece a: Application layer (caso de uso).
 * Interacciones: depende de `OrganizacionRepository` y usa `AppError` para 404.
 */
import { Injectable } from '@nestjs/common';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class GetOrganizacionUseCase {
  constructor(private readonly organizacionRepository: OrganizacionRepository) {}

  /**
   * Busca una organización por id; lanza 404 si no existe.
   * @param id - identificador numérico de la organización.
   * @returns organización de dominio.
   */
  async execute(id: number) {
    const organizacion = await this.organizacionRepository.findById(id);
    if (!organizacion) {
      throw new AppError('Organización no encontrada', 404);
    }
    return organizacion;
  }
}
