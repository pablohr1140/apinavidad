/**
 * # Paseto Service
 * Propósito: Servicio/Auth Paseto Service
 * Pertenece a: Infraestructura / Auth
 * Interacciones: Tokens, servicios de auth
 */
import { TokenPayload, TokenProvider } from '@/application/contracts/Auth';
export declare class PasetoService implements TokenProvider {
    sign(payload: TokenPayload, options?: {
        expiresInMinutes?: number;
    }): Promise<string>;
    verify(token: string): Promise<{
        sub: string;
        email: string;
    }>;
}
