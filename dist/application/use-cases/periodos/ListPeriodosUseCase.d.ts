import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
export declare class ListPeriodosUseCase {
    private readonly periodoRepository;
    constructor(periodoRepository: PeriodoRepository);
    /**
     * Delegación de filtros al repositorio para obtener periodos.
     * @param params - filtros opcionales.
     */
    execute(params?: Parameters<PeriodoRepository['findMany']>[0]): Promise<import("../../../domain/entities").PeriodoProps[]>;
}
