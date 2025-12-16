/**
 * # Prisma Log Repository
 * Propósito: Repositorio Prisma Prisma Log Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
import { LogRepository } from '@/application/repositories/LogRepository';
import { LogProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaLogRepository implements LogRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Omit<LogProps, 'id' | 'createdAt' | 'updatedAt'> & {
        createdAt?: Date;
        updatedAt?: Date;
    }): Promise<LogProps>;
    private toPersistence;
    private toDomain;
}
