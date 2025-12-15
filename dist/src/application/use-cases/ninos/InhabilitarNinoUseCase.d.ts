/**
 * # Inhabilitar Nino Use Case
 * Propósito: Caso de uso Inhabilitar Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
interface Payload {
    fecha: Date;
    motivo: string;
    personaId?: number;
}
export declare class InhabilitarNinoUseCase {
    private readonly ninoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, delega inhabilitación con motivo/fecha y registra auditoría.
     * @param id - identificador del niño.
     * @param payload - datos de inhabilitación (fecha, motivo, personaId opcional).
     */
    execute(id: number, payload: Payload): Promise<import("../../../domain/entities").NinoProps>;
}
export {};
