/**
 * # PeriodoRepository
 *
 * Propósito: contrato para administrar periodos y sus cambios de estado.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoProps`; usado por casos de uso de periodos.
 */
import { PeriodoProps } from '@/domain/entities';
export declare abstract class PeriodoRepository {
    /** Lista periodos con filtros por estado/activo. */
    abstract findMany(params?: {
        estado?: string;
        activo?: boolean;
    }): Promise<PeriodoProps[]>;
    /** Recupera un periodo por id. */
    abstract findById(id: number): Promise<PeriodoProps | null>;
    /** Crea un nuevo periodo. */
    abstract create(data: Omit<PeriodoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<PeriodoProps>;
    /** Actualiza propiedades del periodo. */
    abstract update(id: number, data: Partial<Omit<PeriodoProps, 'id'>>): Promise<PeriodoProps>;
    /** Marca el periodo como abierto. */
    abstract open(id: number): Promise<PeriodoProps>;
    /** Marca el periodo como cerrado. */
    abstract close(id: number): Promise<PeriodoProps>;
    /** Marca el periodo como activo. */
    abstract activate(id: number): Promise<PeriodoProps>;
}
