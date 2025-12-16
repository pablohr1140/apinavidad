/**
 * # Create Organizacion Use Case
 * Propósito: Caso de uso Create Organizacion Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class CreateOrganizacionUseCase {
    private readonly organizacionRepository;
    private readonly logActivityUseCase;
    constructor(organizacionRepository: OrganizacionRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida el payload de creación, delega al repositorio y registra actividad.
     * @param data - entrada cruda (validada con Zod antes de persistir).
     * @returns organización creada.
     */
    execute(data: unknown): Promise<import("../../../domain/entities").OrganizacionProps>;
}
