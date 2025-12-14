import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { PeriodoProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaPeriodoRepository implements PeriodoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMany(params?: {
        estado?: string;
        activo?: boolean;
    }): Promise<PeriodoProps[]>;
    findById(id: number): Promise<PeriodoProps | null>;
    create(data: Omit<PeriodoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<PeriodoProps>;
    update(id: number, data: Partial<Omit<PeriodoProps, 'id'>>): Promise<PeriodoProps>;
    open(id: number): Promise<PeriodoProps>;
    close(id: number): Promise<PeriodoProps>;
    /** Desactiva todos y activa el periodo dado dentro de una transacción. */
    activate(id: number): Promise<PeriodoProps>;
    private mapCreateData;
    private mapUpdateData;
    private toDomain;
}
