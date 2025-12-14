import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class CreatePeriodoUseCase {
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida el DTO, crea el periodo y registra actividad.
     * @param data - payload crudo a validar.
     */
    execute(data: unknown): Promise<import("../../../domain/entities").PeriodoProps>;
}
