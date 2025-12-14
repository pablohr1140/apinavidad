import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { OrganizacionProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
type CreateInput = Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateInput = Partial<Omit<OrganizacionProps, 'id'>>;
export declare class PrismaOrganizacionRepository implements OrganizacionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMany(params?: {
        estado?: string;
        tipo?: string;
    }): Promise<OrganizacionProps[]>;
    findById(id: number): Promise<OrganizacionProps | null>;
    create(data: CreateInput): Promise<OrganizacionProps>;
    update(id: number, data: UpdateInput): Promise<OrganizacionProps>;
    delete(id: number): Promise<void>;
    private toDomain;
    private mapCreateData;
    private mapUpdateData;
}
export {};
