/**
 * # permissions.guard
 * Propósito: Guardia de acceso permissions.guard
 * Pertenece a: Auth/Route Guard (Nest)
 * Interacciones: Nest ExecutionContext, servicios de auth
 */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { PermissionCode } from '@/domain/access-control';
import { PERMISSIONS_KEY, type PermissionsMetadata } from '@/modules/auth/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const metadata = this.reflector.getAllAndOverride<PermissionsMetadata | PermissionCode[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!metadata) {
      return true;
    }

    const requirement = this.normalize(metadata);

    if (requirement.permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No autenticado');
    }

    const hasAccess =
      requirement.mode === 'all'
        ? requirement.permissions.every((permission) => user.permissions.has(permission))
        : requirement.permissions.some((permission) => user.permissions.has(permission));

    if (!hasAccess) {
      const detail = requirement.mode === 'all' ? 'todos los permisos requeridos' : 'al menos un permiso requerido';
      throw new ForbiddenException(`Permisos insuficientes: falta ${detail}`);
    }

    return true;
  }

  private normalize(metadata: PermissionsMetadata | PermissionCode[]): PermissionsMetadata {
    if (Array.isArray(metadata)) {
      return { permissions: metadata, mode: 'any' };
    }

    return metadata;
  }
}
