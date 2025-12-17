/**
 * RefreshTokenUseCase
 * Capa: Aplicación / Caso de uso
 * Responsabilidad: Validar refresh token PASETO, verificar rotación en Redis, emitir nuevo par access/refresh con versión incrementada.
 * Dependencias: TokenProvider (PasetoService), RefreshTokenStore (Redis), AppError.
 * Flujo: verify token -> validar tokenType=refresh y metadatos -> checar versión en store -> rotar a versión+1 -> firmar tokens -> persistir versión.
 * Endpoints impactados: POST /auth/refresh (AuthController).
 */
import { Injectable } from '@nestjs/common';

import { TokenProvider } from '@/application/contracts/Auth';
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from '@/config/auth';
import { RefreshTokenStore } from '@/modules/auth/services/refresh-token.store';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly refreshTokenStore: RefreshTokenStore
  ) {}

  /**
    * Verifica el refresh token y genera tokens renovados.
    * @param token refresh token vigente (PASETO con tokenType=refresh, sessionId, tokenVersion)
    * @returns nuevo accessToken y refreshToken (version+1)
    * Efectos: lectura/escritura en Redis (rotación de versión); falla con 401 si token reutilizado/revocado.
   */
  async execute(token: string) {
    const payload = await this.tokenProvider.verify(token);

    if (payload.tokenType && payload.tokenType !== 'refresh') {
      throw new AppError('Tipo de token inválido', 401);
    }

    if (!payload.sessionId || typeof payload.tokenVersion !== 'number') {
      throw new AppError('Refresh token inválido', 401);
    }

    const isCurrent = await this.refreshTokenStore.isCurrent(payload.sub, payload.sessionId, payload.tokenVersion);
    if (!isCurrent) {
      throw new AppError('Refresh token reutilizado o revocado', 401);
    }

    const nextVersion = payload.tokenVersion + 1;
    const basePayload = { sub: payload.sub, email: payload.email, sessionId: payload.sessionId };

    const [newToken, newRefresh] = await Promise.all([
      this.tokenProvider.sign(
        { ...basePayload, tokenType: 'access' },
        { expiresInMinutes: ACCESS_TOKEN_TTL_MINUTES }
      ),
      this.tokenProvider.sign(
        { ...basePayload, tokenType: 'refresh', tokenVersion: nextVersion },
        { expiresInMinutes: REFRESH_TOKEN_TTL_MINUTES }
      )
    ]);

    await this.refreshTokenStore.rotate(payload.sub, payload.sessionId, nextVersion);

    return {
      accessToken: newToken,
      refreshToken: newRefresh
    };
  }
}
