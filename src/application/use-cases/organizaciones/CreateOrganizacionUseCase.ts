/**
 * # Create Organizacion Use Case
 * Propósito: Caso de uso Create Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # CreateOrganizacionUseCase
 *
 * Propósito: crear organizaciones validando DTO con Zod y registrando auditoría.
 * Pertenece a: Application layer; coordina validación + repositorio + logging.
 * Interacciones: usa `createOrganizacionSchema`, `OrganizacionRepository` y `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { createOrganizacionSchema } from '@/application/dtos/OrganizacionDTOs';
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';

@Injectable()
export class CreateOrganizacionUseCase {
  constructor(
    private readonly organizacionRepository: OrganizacionRepository,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida el payload de creación, delega al repositorio y registra actividad.
   * @param data - entrada cruda (validada con Zod antes de persistir).
   * @returns organización creada.
   */
  execute(data: unknown) {
    const payload = createOrganizacionSchema.parse(data);
    return this.organizacionRepository.create(payload as never).then((created) => {
      void this.logActivityUseCase.execute({
        accion: 'organizacion.creada',
        mensaje: 'Se creó una organización',
        loggableType: 'organizacion',
        loggableId: created.id,
        payload: {
          nombre: created.nombre,
          estado: created.estado,
          tipo: created.tipo
        }
      });

      return created;
    });
  }
}
