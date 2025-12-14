import { NinoRepository } from '@/application/repositories/NinoRepository';
export declare class ListNinosUseCase {
    private readonly ninoRepository;
    constructor(ninoRepository: NinoRepository);
    /**
     * Delegación de búsqueda al repositorio con filtros opcionales.
     * @param params - filtros permitidos por `findMany`.
     */
    execute(params?: Parameters<NinoRepository['findMany']>[0]): Promise<import("../../../domain/entities").NinoProps[]>;
}
