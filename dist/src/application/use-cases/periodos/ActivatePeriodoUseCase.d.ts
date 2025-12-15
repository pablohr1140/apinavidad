/**
 * # Activate Periodo Use Case
 * Propósito: Caso de uso Activate Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class ActivatePeriodoUseCase {
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, activa el periodo y registra actividad.
     * @param id - identificador del periodo.
     */
    execute(id: number): Promise<import("../../../domain/entities").PeriodoProps>;
}
