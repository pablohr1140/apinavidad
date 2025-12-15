/**
 * # Update Nino Use Case
 * Propósito: Caso de uso Update Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
import type { NinoProps } from '@/domain/entities';
export declare class UpdateNinoUseCase {
    private readonly ninoRepository;
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, valida payload, comprueba edad y actualiza; registra auditoría.
     * @param id - identificador del niño.
     * @param data - payload crudo a validar.
     */
    execute(id: number, data: unknown): Promise<NinoProps>;
}
