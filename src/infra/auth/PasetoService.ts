/**
 * # Paseto Service
 * Propósito: Servicio/Auth Paseto Service
 * Pertenece a: Infraestructura / Auth
 * Interacciones: Tokens, servicios de auth
/**
 * PasetoService
 * Capa: Infraestructura / Auth
 * Responsabilidad: Firmar y verificar tokens PASETO v3 (local) para access/refresh, incluyendo expiración y tokenVersion.
 * Dependencias: `paseto` lib, env.PASETO_SECRET (hash sha256), TokenProvider contract.
 * Flujo: sign(payload, exp opcional) -> agrega exp; verify(token) -> valida exp, normaliza tokenVersion.
 * Endpoints impactados: /auth/login, /auth/refresh y cualquier guard que valide tokens.
 */

import { TokenPayload, TokenProvider } from '@/application/contracts/Auth';
import { env } from '@/config/env';

const secretKey = createHash('sha256').update(env.PASETO_SECRET).digest();

@Injectable()
export class PasetoService implements TokenProvider {
  async sign(payload: TokenPayload, options?: { expiresInMinutes?: number }) {
    const exp = new Date(Date.now() + (options?.expiresInMinutes ?? 30) * 60 * 1000);
    return V3.encrypt({ ...payload, exp }, secretKey);
  }

  async verify(token: string) {
    const { exp, tokenVersion, ...payload } = await V3.decrypt<
      TokenPayload & { exp: string | Date; tokenVersion?: number | string }
    >(token, secretKey);
    if (new Date(exp) < new Date()) {
      throw new Error('Token expirado');
    }
    const parsedVersion =
      tokenVersion === undefined || tokenVersion === null ? undefined : Number(tokenVersion);

    return { ...payload, tokenVersion: parsedVersion };
  }
}
