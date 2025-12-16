/**
 * # Organizacion Repository
 * Propósito: Contrato de repositorio Organizacion Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */
/**
 * # OrganizacionRepository
 *
 * Propósito: contrato de persistencia para organizaciones.
 * Pertenece a: Application layer.
 * Interacciones: `OrganizacionProps`; usado por casos de uso de organizaciones.
 */
import { OrganizacionProps } from '@/domain/entities';
export declare abstract class OrganizacionRepository {
    /** Lista organizaciones con filtros opcionales (estado/tipo). */
    abstract findMany(params?: {
        estado?: string;
        tipo?: string;
    }): Promise<OrganizacionProps[]>;
    /** Busca una organización por id. */
    abstract findById(id: number): Promise<OrganizacionProps | null>;
    /** Crea una organización. */
    abstract create(data: Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizacionProps>;
    /** Actualiza propiedades de la organización. */
    abstract update(id: number, data: Partial<Omit<OrganizacionProps, 'id'>>): Promise<OrganizacionProps>;
    /** Elimina una organización (detalle depende de la implementación). */
    abstract delete(id: number): Promise<void>;
}
