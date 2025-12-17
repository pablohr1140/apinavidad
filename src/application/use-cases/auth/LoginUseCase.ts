/**
 * LoginUseCase
 * Capa: Aplicación / Caso de uso
 * Responsabilidad: Autenticar credenciales, generar access/refresh PASETO, crear sesión (sessionId/tokenVersion) y registrar auditoría.
 * Dependencias: UserRepository (DB), HashProvider (bcrypt), TokenProvider (PasetoService), RefreshTokenStore (Redis), LogActivityUseCase.
 * Flujo: valida DTO -> busca usuario -> compara hash -> genera tokens con metadatos -> persiste sesión en Redis -> audita login.
 * Efectos: lectura DB, escritura Redis (sesión refresh), log de actividad.
 * Endpoints impactados: POST /auth/login (AuthController).
 */
import { Injectable } from '@nestjs/common';

import { HashProvider, TokenProvider } from '@/application/contracts/Auth';
import { loginSchema, LoginDTO } from '@/application/dtos/AuthDTOs';
import { UserRepository } from '@/application/repositories/UserRepository';
import { LogActivityUseCase, noopLogActivity } from '@/application/use-cases/logs/LogActivityUseCase';
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_MINUTES } from '@/config/auth';
import { AppError } from '@/shared/errors/AppError';
import { RefreshTokenStore } from '@/modules/auth/services/refresh-token.store';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
    private readonly refreshTokenStore: RefreshTokenStore,
    private readonly logActivityUseCase: LogActivityUseCase = noopLogActivity
  ) {}

  /**
    * Valida credenciales, genera tokens de acceso/refresh con sessionId/tokenVersion y registra auditoría.
    * @param data DTO de login (email, password)
    * @returns accessToken, refreshToken y datos del usuario (id, email, roles)
    * Efectos colaterales: escritura en Redis (sesión refresh) y log de actividad.
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

    const basePayload = { sub: user.id.toString(), email: user.email };
    const { sessionId, tokenVersion } = this.refreshTokenStore.buildNewSession();

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenProvider.sign(
        { ...basePayload, sessionId, tokenType: 'access' },
        { expiresInMinutes: ACCESS_TOKEN_TTL_MINUTES }
      ),
      this.tokenProvider.sign(
        { ...basePayload, sessionId, tokenVersion, tokenType: 'refresh' },
        { expiresInMinutes: REFRESH_TOKEN_TTL_MINUTES }
      )
    ]);

    await this.refreshTokenStore.persistSession(basePayload.sub, sessionId, tokenVersion);

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
