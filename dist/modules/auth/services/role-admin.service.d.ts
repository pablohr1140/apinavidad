import type { RoleKey } from '@/domain/access-control';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';
export declare class RoleAdminService {
    private readonly prisma;
    private readonly authorization;
    constructor(prisma: PrismaService, authorization: AuthorizationService);
    /**
     * Elimina un rol tras validar jerarquía por rank.
     * Si el rol objetivo no existe, simplemente retorna.
     */
    deleteRole(actorRoleKey: RoleKey, targetRoleKey: RoleKey): Promise<void>;
}
