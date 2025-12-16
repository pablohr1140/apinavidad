/**
 * # prisma.service
 * Propósito: Infra DB prisma.service
 * Pertenece a: Infraestructura / Base de datos
 * Interacciones: Prisma, conexión a BD
 */
import { OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleDestroy {
    private static readonly logger;
    constructor();
    onModuleDestroy(): Promise<void>;
    private static resolveConnectionString;
}
