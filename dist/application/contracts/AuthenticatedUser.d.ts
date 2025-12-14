import type { PermissionCode, RoleKey } from '@/domain/access-control';
export interface AuthenticatedRole {
    id: number;
    key: RoleKey;
    name: string;
    rank: number;
}
export interface AuthenticatedUser {
    id: number;
    email: string;
    roles: AuthenticatedRole[];
    permissions: Set<PermissionCode>;
}
