/**
 * # Login Use Case
 * Propósito: Caso de uso Login Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */

/**
 * # LoginUseCase
 *
 * Propósito: autenticar usuarios, generar tokens y auditar inicio de sesión.
 * Pertenece a: Application layer.
 * Interacciones: `UserRepository`, `HashProvider`, `TokenProvider`, `AppError`, `LogActivityUseCase`.
 */
import { Injectable } from '@nestjs/common';

import { HashProvider, TokenProvider } from '@/application/contracts/Auth';
import { loginSchema, LoginDTO } from '@/application/dtos/AuthDTOs';
import { UserRepository } from '@/application/repositories/UserRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from '@/config/auth';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
   * Valida credenciales, genera tokens de acceso/refresh y registra auditoría.
   * @param data - DTO de login a validar.
   */
  async execute(data: LoginDTO) {
    const payload = loginSchema.parse(data);
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const match = await this.hashProvider.compare(payload.password, user.passwordHash);
    if (!match) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const tokenPayload = { sub: user.id.toString(), email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenProvider.sign(tokenPayload, { expiresInMinutes: ACCESS_TOKEN_TTL_MINUTES }),
      this.tokenProvider.sign(tokenPayload, { expiresInMinutes: REFRESH_TOKEN_TTL_MINUTES })
    ]);

    await this.logActivityUseCase.execute({
      personaId: user.id,
      accion: 'auth.login',
      mensaje: 'Inicio de sesión exitoso',
      loggableType: 'auth',
      loggableId: user.id,
      payload: {
        email: user.email,
        roles: user.roles.map((role) => role.key)
      }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.key)
      }
    };
  }
}
