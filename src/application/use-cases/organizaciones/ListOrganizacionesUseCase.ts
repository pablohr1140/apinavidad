/**
 * # List Organizaciones Use Case
 * Propósito: Caso de uso List Organizaciones Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # ListOrganizacionesUseCase
 *
 * Propósito: listar organizaciones filtrando por estado/tipo a través del repositorio inyectado.
 * Pertenece a: Application layer (caso de uso); orquesta dominio <- repositorio.
 * Interacciones: depende de `OrganizacionRepository` (Prisma).
 */
import { Injectable } from '@nestjs/common';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';

@Injectable()
export class ListOrganizacionesUseCase {
  constructor(private readonly organizacionRepository: OrganizacionRepository) {}

  /**
   * Ejecuta la búsqueda de organizaciones según filtros opcionales (estado, tipo, etc.).
   * @param params - filtros delegados al repositorio.
   * @returns arreglo de organizaciones en formato de dominio.
   */
  execute(params?: Parameters<OrganizacionRepository['findMany']>[0]) {
    return this.organizacionRepository.findMany(params);
  }
}
