import { NinoRepository } from '@/application/repositories/NinoRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
interface Params {
    fechaReferencia?: Date;
    dryRun?: boolean;
}
export declare class AutoInhabilitarNinosUseCase {
    private readonly ninoRepository;
    private readonly logActivityUseCase;
    constructor(ninoRepository: NinoRepository, logActivityUseCase?: LogActivityUseCase);
    /**
     * Ejecuta la auto-inhabilitación (o dry-run) y registra el resultado.
     * @param fechaReferencia - fecha a usar para calcular edad.
     * @param dryRun - si es true, solo reporta sin persistir cambios.
     */
    execute({ fechaReferencia, dryRun }: Params): Promise<{
        afectados: number;
    } & {
        detalles?: import("../../../domain/entities").NinoProps[];
    }>;
}
export {};
