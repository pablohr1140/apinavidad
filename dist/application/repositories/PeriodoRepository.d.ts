/**
 * # Periodo Repository
 * Propósito: Contrato de repositorio Periodo Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */
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
    /** Detecta si existe un periodo que se sobrepone en fechas (opcionalmente excluyendo uno). */
    abstract findOverlapping(params: {
        start?: Date | null;
        end?: Date | null;
        excludeId?: number;
    }): Promise<PeriodoProps | null>;
    /** Marca el periodo como abierto. */
    abstract open(id: number): Promise<PeriodoProps>;
    /** Marca el periodo como cerrado. */
    abstract close(id: number): Promise<PeriodoProps>;
    /** Marca el periodo como activo. */
    abstract activate(id: number): Promise<PeriodoProps>;
}
