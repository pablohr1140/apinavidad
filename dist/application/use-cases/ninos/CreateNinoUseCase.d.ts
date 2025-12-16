/**
 * # Create Nino Use Case
 * Propósito: Caso de uso Create Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class CreateNinoUseCase {
    private readonly ninoRepository;
    private readonly periodoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, periodoRepository: PeriodoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida el DTO, comprueba edad máxima y crea el niño; luego registra auditoría.
     * @param data - payload crudo a validar.
     */
    execute(data: unknown): Promise<import("../../../domain/entities").NinoProps>;
}
