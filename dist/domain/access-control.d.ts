export declare const ROLE_KEYS: readonly ["SUPERADMIN", "ADMIN", "DIDECO", "REPRESENTANTE", "PROVIDENCIA"];
export type RoleKey = typeof ROLE_KEYS[number];
export declare const PERMISSION_RESOURCES: readonly ["ninos", "organizaciones", "personas", "discapacidad", "periodos", "perfil"];
export type PermissionResource = typeof PERMISSION_RESOURCES[number];
export declare const PERMISSION_ACTIONS: readonly ["view", "create", "update", "delete"];
export type PermissionAction = typeof PERMISSION_ACTIONS[number];
export type PermissionCode = `${PermissionResource}.${PermissionAction}`;
export interface RoleDefinition {
    key: RoleKey;
    name: string;
    description?: string;
    rank: number;
    permissions: PermissionCode[];
}
export declare const ALL_PERMISSION_CODES: ("ninos.create" | "ninos.view" | "ninos.update" | "ninos.delete" | "organizaciones.create" | "organizaciones.view" | "organizaciones.update" | "organizaciones.delete" | "periodos.create" | "periodos.view" | "periodos.update" | "periodos.delete" | "personas.create" | "personas.view" | "personas.update" | "personas.delete" | "discapacidad.create" | "discapacidad.view" | "discapacidad.update" | "discapacidad.delete" | "perfil.create" | "perfil.view" | "perfil.update" | "perfil.delete")[];
export declare const ROLE_DEFINITIONS: RoleDefinition[];
export declare const getRoleDefinition: (key: RoleKey) => RoleDefinition | undefined;
