import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
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
