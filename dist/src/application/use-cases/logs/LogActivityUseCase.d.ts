import { LogRepository } from '@/application/repositories/LogRepository';
import { LogProps } from '@/domain/entities';
interface LogInput {
    personaId?: number;
    accion: string;
    mensaje: string;
    loggableId?: number;
    loggableType?: string;
    payload?: Record<string, unknown>;
    ip?: string;
    user_agent?: string;
}
export declare class LogActivityUseCase {
    private readonly logRepository;
    constructor(logRepository: LogRepository);
    /**
     * Persiste la actividad con timestamp actual.
     * @param input - datos de actividad a registrar.
     */
    execute(input: LogInput): Promise<LogProps>;
}
export declare const noopLogActivity: LogActivityUseCase;
export {};
