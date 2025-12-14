/**
 * # Update Organizacion Use Case
 * Propósito: Caso de uso Update Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # UpdateOrganizacionUseCase
 *
 * Propósito: actualizar organizaciones tras validar existencia y payload, registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `OrganizacionRepository`, `updateOrganizacionSchema`, `LogActivityUseCase`, `AppError`.
 */
import { Injectable } from '@nestjs/common';

import { updateOrganizacionSchema } from '@/application/dtos/OrganizacionDTOs';
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class UpdateOrganizacionUseCase {
  constructor(
    private readonly organizacionRepository: OrganizacionRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Verifica existencia, valida con Zod y actualiza la organización; luego registra el cambio.
   * @param id - identificador de la organización.
   * @param data - payload crudo a validar.
   * @returns organización actualizada.
   */
  async execute(id: number, data: unknown) {
    const organizacion = await this.organizacionRepository.findById(id);
    if (!organizacion) {
      throw new AppError('Organización no encontrada', 404);
    }
    const payload = updateOrganizacionSchema.parse(data);
    const updated = await this.organizacionRepository.update(id, payload);

    await this.logActivityUseCase.execute({
      accion: 'organizacion.actualizada',
      mensaje: 'Se actualizó una organización',
      loggableType: 'organizacion',
      loggableId: id,
      payload
    });

    return updated;
  }
}
