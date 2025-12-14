import type { RoleKey } from '@/domain/access-control';
import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { RedisService } from '@/infra/cache/redis.service';
export declare class AuthorizationService {
    private readonly prisma;
    private readonly redisService;
    constructor(prisma: PrismaService, redisService: RedisService);
    buildUserContext(userId: number, fallbackEmail?: string): Promise<AuthenticatedUser>;
    invalidateRoleCache(roleKey: RoleKey): Promise<void>;
    private aggregatePermissions;
    private resolveRolePermissions;
}
