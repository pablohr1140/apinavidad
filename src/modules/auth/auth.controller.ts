/**
 * AuthController
 * Capa: Interface / HTTP (NestJS)
 * Responsabilidad: Login y refresh de tokens PASETO, seteo de cookies HttpOnly/Secure.
 * Seguridad actual: Endpoints públicos, con rate-limit por ruta. CSRF: enviar `X-CSRF-Token` en POST desde frontend; tokens en cookies.
 * Endpoints y contratos:
 *  - POST /auth/login: body { email, password }; resp: { user, accessToken, refreshToken }; setea cookies `infancias_access_token` y `infancias_refresh_token`.
 *  - POST /auth/refresh: body { refreshToken? } opcional; si falta, lee cookie; resp: { user, accessToken, refreshToken }; rota cookies.
 * Headers/cookies: `X-CSRF-Token` requerido para POST; Authorization Bearer opcional (normalmente usa cookie). Cookies HttpOnly, Secure en prod, SameSite=lax.
 * Ejemplo de integración frontend (descriptivo): tras login, guardar `X-CSRF-Token` y reenviarlo en mutaciones; dejar que el navegador maneje cookies; refrescar token con POST /auth/refresh antes de expirar.
 */
import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';

import {
  loginSchema,
  refreshRequestSchema,
  type LoginDTO,
  type RefreshRequestDTO
} from '@/application/dtos/AuthDTOs';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_TTL_MINUTES,
  REFRESH_TOKEN_TTL_MINUTES,
  buildCookieOptions
} from '@/config/auth';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { RateLimit } from '@/modules/auth/decorators/rate-limit.decorator';
import { RateLimitGuard } from '@/modules/auth/guards/rate-limit.guard';
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Public()
  @Post('login')
  @RateLimit('auth:login', 5, 60)
  @UseGuards(RateLimitGuard)
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    /**
     * Maneja login:
     * - Valida credenciales (Zod DTO).
     * - Ejecuta LoginUseCase -> genera access/refresh y persiste sesión en Redis.
     * - Setea cookies HttpOnly/Secure (según entorno) y SameSite=lax.
     * Frontend: enviar email/password; leer resultado JSON (user + tokens) aunque tokens van en cookies.
     */
    const result = await this.loginUseCase.execute(body);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post('refresh')
  @RateLimit('auth:refresh', 10, 60)
  @UseGuards(RateLimitGuard)
  async refresh(
    @Body(new ZodValidationPipe(refreshRequestSchema)) body: RefreshRequestDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    /**
     * Maneja refresh:
     * - Obtiene refreshToken de body o cookie.
     * - Ejecuta RefreshTokenUseCase -> valida tokenType=refresh y versión en Redis, rota y retorna nuevo par.
     * - Setea nuevas cookies de access/refresh.
     * Frontend: enviar refreshToken (opcional si cookie), CSRF header requerido; esperar nuevas cookies.
     */
    const refreshToken = body.refreshToken ?? req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token es requerido');
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      buildCookieOptions(ACCESS_TOKEN_TTL_MINUTES)
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      buildCookieOptions(REFRESH_TOKEN_TTL_MINUTES)
    );
  }
}
