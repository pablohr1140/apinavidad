/**
 * RateLimitGuard
 * Capa: Interface / Guards (Nest)
 * Responsabilidad: Aplicar límites de solicitudes por IP y prefijo usando Redis (incr + TTL).
 * Dependencias: RedisService, Reflector (metadatos @RateLimit).
 * Flujo: lee config del decorador -> calcula clave IP -> incrementa contador -> lanza 429 si excede.
 * Endpoints impactados: los anotados con @RateLimit (ej. /auth/login, /auth/refresh).
 * Frontend: ante 429 reintentar después del TTL configurado.
 */
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { RedisService } from '@/infra/cache/redis.service';
import { RATE_LIMIT_METADATA_KEY, type RateLimitConfig } from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.reflector.getAllAndOverride<RateLimitConfig | undefined>(RATE_LIMIT_METADATA_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!config) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const identifier = request.ip || 'unknown';
    const key = `${config.prefix}:${identifier}`;

    const count = await this.redisService.incr(key, config.ttlSeconds);

    if (count > config.limit) {
      throw new HttpException('Demasiadas solicitudes, inténtalo más tarde.', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}