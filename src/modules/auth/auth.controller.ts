/**
 * # auth.controller
 * Propósito: Endpoints HTTP de auth.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # AuthController
 *
 * Propósito: expone endpoints de login y refresh que delegan en casos de uso y setean cookies.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: `LoginUseCase`, `RefreshTokenUseCase`, cookies de auth.
 */
import { BadRequestException, Body, Controller, Post, Req, Res } from '@nestjs/common';
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
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginDTO,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.loginUseCase.execute(body);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body(new ZodValidationPipe(refreshRequestSchema)) body: RefreshRequestDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
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
