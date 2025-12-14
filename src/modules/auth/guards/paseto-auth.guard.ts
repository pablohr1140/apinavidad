/**
 * # paseto auth.guard
 * Propósito: Guardia de acceso paseto auth.guard
 * Pertenece a: Auth/Route Guard (Nest)
 * Interacciones: Nest ExecutionContext, servicios de auth
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ACCESS_TOKEN_COOKIE_NAME } from '@/config/auth';
import { PasetoService } from '@/infra/auth/PasetoService';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';

@Injectable()
export class PasetoAuthGuard implements CanActivate {
  private readonly reflector: Reflector;

  constructor(
    reflector: Reflector,
    private readonly pasetoService: PasetoService,
    private readonly authorizationService: AuthorizationService
  ) {
    this.reflector = reflector ?? new Reflector();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { cookies?: Record<string, string> }>();
    const header = request.headers.authorization;
    const tokenFromHeader = header?.startsWith('Bearer ')
      ? header.split(' ')[1]
      : undefined;
    const tokenFromCookie = request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    const token = tokenFromHeader ?? tokenFromCookie;

    if (!token) {
      throw new UnauthorizedException('Falta token de autenticación');
    }

    try {
      const payload = await this.pasetoService.verify(token);
      const userId = Number(payload.sub);
      if (Number.isNaN(userId)) {
        throw new UnauthorizedException('Token inválido');
      }

      const authUser = await this.authorizationService.buildUserContext(userId, payload.email);
      Object.assign(request, { user: authUser });
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
