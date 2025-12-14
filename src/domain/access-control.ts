/**
 * # access control
 * Propósito: Dominio access control
 * Pertenece a: Dominio
 * Interacciones: Entidades, reglas de negocio
 */

export const ROLE_KEYS = ['SUPERADMIN', 'ADMIN', 'DIDECO', 'REPRESENTANTE', 'PROVIDENCIA'] as const;
export type RoleKey = typeof ROLE_KEYS[number];

export const PERMISSION_RESOURCES = ['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos', 'perfil'] as const;
export type PermissionResource = typeof PERMISSION_RESOURCES[number];

export const PERMISSION_ACTIONS = ['view', 'create', 'update', 'delete'] as const;
export type PermissionAction = typeof PERMISSION_ACTIONS[number];

export type PermissionCode = `${PermissionResource}.${PermissionAction}`;

export interface RoleDefinition {
	key: RoleKey;
	name: string;
	description?: string;
	rank: number;
	permissions: PermissionCode[];
}

const buildPermissionCodes = (resource: PermissionResource): PermissionCode[] =>
	PERMISSION_ACTIONS.map((action) => `${resource}.${action}` as PermissionCode);

export const ALL_PERMISSION_CODES = PERMISSION_RESOURCES.flatMap(buildPermissionCodes);

const grantForResources = (resources: PermissionResource[]): PermissionCode[] =>
	resources.flatMap(buildPermissionCodes);

export const ROLE_DEFINITIONS: RoleDefinition[] = [
	{
		key: 'SUPERADMIN',
		name: 'Superadministrador',
		rank: 500,
		permissions: ALL_PERMISSION_CODES
	},
	{
		key: 'ADMIN',
		name: 'Administrador',
		rank: 400,
		permissions: grantForResources(['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos', 'perfil'])
	},
	{
		key: 'DIDECO',
		name: 'DIDECO',
		rank: 300,
		permissions: grantForResources(['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos'])
	},
	{
		key: 'REPRESENTANTE',
		name: 'Representante',
		rank: 200,
		permissions: grantForResources(['ninos'])
	},
	{
		key: 'PROVIDENCIA',
		name: 'Providencia',
		rank: 100,
		permissions: []
	}
];

export const getRoleDefinition = (key: RoleKey) => ROLE_DEFINITIONS.find((role) => role.key === key);
