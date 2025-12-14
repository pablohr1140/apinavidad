/**
 * # auth user.decorator
 * Propósito: Decorador auth user.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): AuthenticatedUser | undefined => {
  const request = ctx.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
  return request.user;
});
