import { PersonaCreateInput, PersonaRepository, PersonaUpdateInput } from '@/application/repositories/PersonaRepository';
import { PersonaProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaPersonaRepository implements PersonaRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMany(params?: {
        organizacionId?: number;
        search?: string;
    }): Promise<PersonaProps[]>;
    /** Recupera persona por id incluyendo rol. */
    findById(id: number): Promise<PersonaProps | null>;
    create(data: PersonaCreateInput): Promise<PersonaProps>;
    update(id: number, data: PersonaUpdateInput): Promise<PersonaProps>;
    delete(id: number): Promise<void>;
    private toDomain;
    private mapCreateData;
    private mapUpdateData;
    private resolveRoleId;
}
