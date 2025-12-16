/**
 * # Open Periodo Use Case
 * Propósito: Caso de uso Open Periodo Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class OpenPeriodoUseCase {
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, abre el periodo y registra la acción.
     * @param id - identificador de periodo.
     */
    execute(id: number): Promise<import("../../../domain/entities").PeriodoProps>;
}
