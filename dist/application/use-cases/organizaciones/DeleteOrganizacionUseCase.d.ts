import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class DeleteOrganizacionUseCase {
    private readonly organizacionRepository;
    private readonly logActivityUseCase;
    constructor(organizacionRepository: OrganizacionRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Verifica existencia, elimina la organización y registra el evento.
     * @param id - identificador de la organización.
     */
    execute(id: number): Promise<void>;
}
