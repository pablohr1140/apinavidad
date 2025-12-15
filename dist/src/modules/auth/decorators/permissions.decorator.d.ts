/**
 * # permissions.decorator
 * Propósito: Decorador permissions.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */
import { type CustomDecorator } from '@nestjs/common';
import type { PermissionCode } from '@/domain/access-control';
export declare const PERMISSIONS_KEY = "requiredPermissions";
export type PermissionMode = 'any' | 'all';
export interface PermissionsConfig {
    permissions: PermissionCode[];
    mode?: PermissionMode;
}
export interface PermissionsMetadata {
    permissions: PermissionCode[];
    mode: PermissionMode;
}
export declare function Permissions(...args: [PermissionsConfig] | PermissionCode[]): CustomDecorator;
