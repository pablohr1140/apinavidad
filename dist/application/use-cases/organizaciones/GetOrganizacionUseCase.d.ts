/**
 * # Get Organizacion Use Case
 * Propósito: Caso de uso Get Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
export declare class GetOrganizacionUseCase {
    private readonly organizacionRepository;
    constructor(organizacionRepository: OrganizacionRepository);
    /**
     * Busca una organización por id; lanza 404 si no existe.
     * @param id - identificador numérico de la organización.
     * @returns organización de dominio.
     */
    execute(id: number): Promise<import("../../../domain/entities").OrganizacionProps>;
}
