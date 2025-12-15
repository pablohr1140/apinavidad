/**
 * # Restaurar Nino Use Case
 * Propósito: Caso de uso Restaurar Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class RestaurarNinoUseCase {
    private readonly ninoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, restaura el estado y registra el evento.
     * @param id - identificador del niño.
     * @param personaId - actor opcional para la auditoría.
     */
    execute(id: number, personaId?: number): Promise<import("../../../domain/entities").NinoProps>;
}
