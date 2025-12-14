import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class CreatePersonaUseCase {
    private readonly personaRepository;
    private readonly logActivityUseCase;
    constructor(personaRepository: PersonaRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida el DTO, crea la persona con roles y registra auditoría.
     * @param data - entrada cruda a validar.
     * @returns persona creada.
     */
    execute(data: unknown): Promise<import("../../../domain/entities").PersonaProps>;
}
