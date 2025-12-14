import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class CreateNinoUseCase {
    private readonly ninoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida el DTO, comprueba edad máxima y crea el niño; luego registra auditoría.
     * @param data - payload crudo a validar.
     */
    execute(data: unknown): Promise<import("../../../domain/entities").NinoProps>;
}
