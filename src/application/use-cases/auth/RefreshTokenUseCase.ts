/**
 * # Refresh Token Use Case
 * Propósito: Caso de uso Refresh Token Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # RefreshTokenUseCase
 *
 * Propósito: validar refresh token y emitir un nuevo par de tokens.
 * Pertenece a: Application layer.
 * Interacciones: `TokenProvider`.
 */
import { Injectable } from '@nestjs/common';

import { TokenProvider } from '@/application/contracts/Auth';
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from '@/config/auth';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly tokenProvider: TokenProvider) {}

  /**
   * Verifica el refresh token y genera tokens renovados.
   * @param token - refresh token vigente.
   */
  async execute(token: string) {
    const payload = await this.tokenProvider.verify(token);
    const newToken = await this.tokenProvider.sign(payload, { expiresInMinutes: ACCESS_TOKEN_TTL_MINUTES });
    const newRefresh = await this.tokenProvider.sign(payload, { expiresInMinutes: REFRESH_TOKEN_TTL_MINUTES });

    return {
      accessToken: newToken,
      refreshToken: newRefresh
    };
  }
}
