/**
 * # permissions.guard
 * Propósito: Guardia de acceso permissions.guard
 * Pertenece a: Auth/Route Guard (Nest)
 * Interacciones: Nest ExecutionContext, servicios de auth
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private normalize;
}
