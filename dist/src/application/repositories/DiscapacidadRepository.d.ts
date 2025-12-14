/**
 * # DiscapacidadRepository
 *
 * Propósito: contrato de persistencia para discapacidades/catalogo de condiciones.
 * Pertenece a: Application layer.
 * Interacciones: `DiscapacidadProps`.
 */
import { DiscapacidadProps } from '@/domain/entities';
export declare abstract class DiscapacidadRepository {
    /** Lista discapacidades con filtro por estado activo. */
    abstract findMany(params?: {
        activo?: boolean;
    }): Promise<DiscapacidadProps[]>;
    /** Crea una discapacidad. */
    abstract create(data: Omit<DiscapacidadProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscapacidadProps>;
}
