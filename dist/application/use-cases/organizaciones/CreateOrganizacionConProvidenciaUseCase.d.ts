import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class CreateOrganizacionConProvidenciaUseCase {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(data: unknown): Promise<{
        id: number;
        nombre: string;
        tipo: string;
        direccion: string | undefined;
        telefono: string | undefined;
        email: string | undefined;
        providenciaId: number | undefined;
        sectorId: number | undefined;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
        providencia: {
            id: number;
            nombre: string;
            codigo: string | undefined;
            activo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
