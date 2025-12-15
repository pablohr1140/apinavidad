/**
 * # Get Nino Use Case
 * Propósito: Caso de uso Get Nino Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { NinoRepository } from '@/application/repositories/NinoRepository';
export declare class GetNinoUseCase {
    private readonly ninoRepository;
    constructor(ninoRepository: NinoRepository);
    /**
     * Busca un niño por id y lanza `AppError` 404 si no se encuentra.
     * @param id - identificador del niño.
     */
    execute(id: number): Promise<import("../../../domain/entities").NinoProps>;
}
