import { NinoRepository } from '@/application/repositories/NinoRepository';
import { EstadoNino, NinoProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaNinoRepository implements NinoRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findMany(params?: {
        periodoId?: number;
        organizacionId?: number;
        estado?: EstadoNino;
        edadMin?: number;
        edadMax?: number;
        prioridad?: number;
        tiempoParaInhabilitar?: number;
        skip?: number;
        take?: number;
    }): Promise<NinoProps[]>;
    findById(id: number): Promise<NinoProps | null>;
    create(data: Omit<NinoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<NinoProps>;
    update(id: number, data: Partial<Omit<NinoProps, 'id'>>): Promise<NinoProps>;
    inhabilitar(id: number, payload: {
        fecha: Date;
        motivo: string;
    }): Promise<NinoProps>;
    restaurar(id: number): Promise<NinoProps>;
    autoInhabilitar(fechaReferencia: Date, dryRun?: boolean): Promise<{
        afectados: number;
    } & {
        detalles?: NinoProps[];
    }>;
    private mapCreateData;
    private mapUpdateData;
    private toDomain;
}
