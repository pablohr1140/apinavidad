import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { RoleKey } from '@/domain/access-control';
import { RoleAdminService } from '@/modules/auth/services/role-admin.service';
export declare class RolesController {
    private readonly roleAdminService;
    constructor(roleAdminService: RoleAdminService);
    deleteRole(roleKey: RoleKey, user: AuthenticatedUser): Promise<void>;
}
