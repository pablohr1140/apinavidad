/**
 * # LogRepository
 *
 * Propósito: contrato para persistir logs/auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `LogProps`; usado por `LogActivityUseCase`.
 */
import { LogProps } from '@/domain/entities';
export declare abstract class LogRepository {
    /** Crea un registro de log; `createdAt` viene de la capa de aplicación. */
    abstract create(data: Omit<LogProps, 'id' | 'createdAt' | 'updatedAt'> & {
        createdAt?: Date;
        updatedAt?: Date;
    }): Promise<LogProps>;
}
