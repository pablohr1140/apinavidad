import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class UpdateNinoUseCase {
    private readonly ninoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, valida payload, comprueba edad y actualiza; registra auditoría.
     * @param id - identificador del niño.
     * @param data - payload crudo a validar.
     */
    execute(id: number, data: unknown): Promise<import("../../../domain/entities").NinoProps>;
}
