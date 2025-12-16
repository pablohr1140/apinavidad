/**
 * # Get Periodo Use Case
 * Prop3sito: Caso de uso Get Periodo Use Case
 * Pertenece a: Aplicacibn / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
export declare class GetPeriodoUseCase {
    private readonly periodoRepository;
    constructor(periodoRepository: PeriodoRepository);
    /**
     * Busca un periodo por id; lanza 404 si no existe.
     * @param id - identificador del periodo.
     */
    execute(id: number): Promise<import("../../../domain/entities").PeriodoProps>;
}
