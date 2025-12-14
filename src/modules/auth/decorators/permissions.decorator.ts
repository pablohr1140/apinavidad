/**
 * # permissions.decorator
 * Propósito: Decorador permissions.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */

import { SetMetadata, type CustomDecorator } from '@nestjs/common';

import type { PermissionCode } from '@/domain/access-control';

export const PERMISSIONS_KEY = 'requiredPermissions';
export type PermissionMode = 'any' | 'all';

export interface PermissionsConfig {
	permissions: PermissionCode[];
	mode?: PermissionMode;
}

export interface PermissionsMetadata {
	permissions: PermissionCode[];
	mode: PermissionMode;
}

function normalize(config: PermissionsConfig): PermissionsMetadata {
	return {
		permissions: config.permissions,
		mode: config.mode ?? 'any'
	};
}

export function Permissions(...args: [PermissionsConfig] | PermissionCode[]): CustomDecorator {
	if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
		return SetMetadata(PERMISSIONS_KEY, normalize(args[0] as PermissionsConfig));
	}

	return SetMetadata(
		PERMISSIONS_KEY,
		normalize({
			permissions: args as PermissionCode[],
			mode: 'any'
		})
	);
}
