/**
 * # Auth
 * Propósito: Archivo Auth
 * Pertenece a: General
 * Interacciones: N/A
 */

/* istanbul ignore file */
export interface TokenPayload {
  sub: string;
  email: string;
  /** Opcional: identifica la sesión de refresh en curso. */
  sessionId?: string;
  /** Opcional: versión incremental para rotación de refresh tokens. */
  tokenVersion?: number;
  /** Diferencia access vs refresh para evitar uso cruzado. */
  tokenType?: 'access' | 'refresh';
}

export abstract class TokenProvider {
  abstract sign(payload: TokenPayload, options?: { expiresInMinutes?: number }): Promise<string>;
  abstract verify(token: string): Promise<TokenPayload>;
}

export abstract class HashProvider {
  abstract hash(plain: string): Promise<string>;
  abstract compare(plain: string, hash: string): Promise<boolean>;
}
