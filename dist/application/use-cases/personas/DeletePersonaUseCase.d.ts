/**
 * # Delete Persona Use Case
 * Propósito: Caso de uso Delete Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class DeletePersonaUseCase {
    private readonly personaRepository;
    private readonly logActivityUseCase;
    constructor(personaRepository: PersonaRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida existencia y jerarquía de roles antes de eliminar; registra auditoría con el actor.
     * @param id - persona a eliminar.
     * @param actor - usuario autenticado que ejecuta la acción.
     */
    execute(id: number, actor: AuthenticatedUser): Promise<void>;
    private getHighestRank;
}
