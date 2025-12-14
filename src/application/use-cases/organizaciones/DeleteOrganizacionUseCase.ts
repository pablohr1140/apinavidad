/**
 * # Delete Organizacion Use Case
 * Propósito: Caso de uso Delete Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # DeleteOrganizacionUseCase
 *
 * Propósito: eliminar organizaciones tras validar existencia y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `OrganizacionRepository`, `LogActivityUseCase`, `AppError` para 404.
 */
import { Injectable } from '@nestjs/common';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class DeleteOrganizacionUseCase {
  constructor(
    private readonly organizacionRepository: OrganizacionRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, elimina la organización y registra el evento.
   * @param id - identificador de la organización.
   */
  async execute(id: number) {
    const organizacion = await this.organizacionRepository.findById(id);
    if (!organizacion) {
      throw new AppError('Organización no encontrada', 404);
    }
    await this.organizacionRepository.delete(id);

    await this.logActivityUseCase.execute({
      accion: 'organizacion.eliminada',
      mensaje: 'Se eliminó una organización',
      loggableType: 'organizacion',
      loggableId: id,
      payload: {
        nombre: organizacion.nombre,
        estado: organizacion.estado
      }
    });
  }
}
