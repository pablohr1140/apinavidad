/**
 * # Update Organizacion Use Case
 * Propósito: Caso de uso Update Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class UpdateOrganizacionUseCase {
    private readonly organizacionRepository;
    private readonly logActivityUseCase;
    constructor(organizacionRepository: OrganizacionRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, valida con Zod y actualiza la organización; luego registra el cambio.
     * @param id - identificador de la organización.
     * @param data - payload crudo a validar.
     * @returns organización actualizada.
     */
    execute(id: number, data: unknown): Promise<import("../../../domain/entities").OrganizacionProps>;
}
