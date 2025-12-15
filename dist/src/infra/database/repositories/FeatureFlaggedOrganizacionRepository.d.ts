/**
 * # Feature Flagged Organizacion Repository
 * Propósito: Repositorio Prisma Feature Flagged Organizacion Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import type { OrganizacionProps } from '@/domain/entities';
export declare class FeatureFlaggedOrganizacionRepository extends OrganizacionRepository {
    private readonly delegate;
    constructor(delegate: OrganizacionRepository);
    findMany(params?: {
        estado?: string;
        tipo?: string;
    }): Promise<OrganizacionProps[]>;
    findById(id: number): Promise<OrganizacionProps | null>;
    create(data: Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizacionProps>;
    update(id: number, data: Partial<Omit<OrganizacionProps, 'id'>>): Promise<OrganizacionProps>;
    delete(id: number): Promise<void>;
}
