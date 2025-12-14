import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class UpdatePeriodoUseCase {
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, valida DTO y actualiza; registra la actividad.
     * @param id - identificador del periodo.
     * @param data - payload crudo a validar.
     */
    execute(id: number, data: unknown): Promise<import("../../../domain/entities").PeriodoProps>;
}
