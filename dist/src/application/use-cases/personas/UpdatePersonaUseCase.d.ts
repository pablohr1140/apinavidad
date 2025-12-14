import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class UpdatePersonaUseCase {
    private readonly personaRepository;
    private readonly logActivityUseCase;
    constructor(personaRepository: PersonaRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, valida DTO, actualiza y registra el cambio.
     * @param id - persona objetivo.
     * @param data - payload crudo a validar.
     */
    execute(id: number, data: unknown): Promise<import("../../../domain/entities").PersonaProps>;
}
