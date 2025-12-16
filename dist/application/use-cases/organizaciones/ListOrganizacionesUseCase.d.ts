/**
 * # List Organizaciones Use Case
 * Propósito: Caso de uso List Organizaciones Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
export declare class ListOrganizacionesUseCase {
    private readonly organizacionRepository;
    constructor(organizacionRepository: OrganizacionRepository);
    /**
     * Ejecuta la búsqueda de organizaciones según filtros opcionales (estado, tipo, etc.).
     * @param params - filtros delegados al repositorio.
     * @returns arreglo de organizaciones en formato de dominio.
     */
    execute(params?: Parameters<OrganizacionRepository['findMany']>[0]): Promise<import("../../../domain/entities").OrganizacionProps[]>;
}
