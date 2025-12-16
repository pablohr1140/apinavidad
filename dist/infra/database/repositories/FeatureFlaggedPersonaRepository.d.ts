/**
 * # Feature Flagged Persona Repository
 * Propósito: Repositorio Prisma Feature Flagged Persona Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
import { PersonaRepository, type PersonaCreateInput, type PersonaUpdateInput } from '@/application/repositories/PersonaRepository';
import type { PersonaProps } from '@/domain/entities';
export declare class FeatureFlaggedPersonaRepository extends PersonaRepository {
    private readonly delegate;
    constructor(delegate: PersonaRepository);
    findMany(params?: {
        organizacionId?: number;
        search?: string;
    }): Promise<PersonaProps[]>;
    findById(id: number): Promise<PersonaProps | null>;
    create(data: PersonaCreateInput): Promise<PersonaProps>;
    update(id: number, data: PersonaUpdateInput): Promise<PersonaProps>;
    delete(id: number): Promise<void>;
}
