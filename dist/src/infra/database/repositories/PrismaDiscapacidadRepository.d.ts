/**
 * # Prisma Discapacidad Repository
 * Propósito: Repositorio Prisma Prisma Discapacidad Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
import { DiscapacidadRepository } from '@/application/repositories/DiscapacidadRepository';
import { DiscapacidadProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaDiscapacidadRepository implements DiscapacidadRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMany(params?: {
        activo?: boolean;
    }): Promise<DiscapacidadProps[]>;
    create(data: Omit<DiscapacidadProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiscapacidadProps>;
    private toDomain;
}
