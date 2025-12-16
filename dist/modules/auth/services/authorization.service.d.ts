/**
 * # authorization.service
 * Propósito: Servicio authorization.service
 * Pertenece a: Servicio de módulo (Nest)
 * Interacciones: Repositorios, servicios externos
 */
import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { RoleKey } from '@/domain/access-control';
import { RedisService } from '@/infra/cache/redis.service';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class AuthorizationService {
    private readonly prisma;
    private readonly redisService;
    constructor(prisma: PrismaService, redisService: RedisService);
    buildUserContext(userId: number, fallbackEmail?: string): Promise<AuthenticatedUser>;
    invalidateRoleCache(roleKey: RoleKey): Promise<void>;
    /**
     * Valida que el rol "actor" pueda eliminar al rol objetivo usando el rank.
     * Si el objetivo tiene un rank mayor o igual, lanza Forbidden.
     */
    assertCanDeleteRole(actorRoleKey: RoleKey, targetRoleKey: RoleKey): Promise<void>;
    private aggregatePermissions;
    private resolveRolePermissions;
}
