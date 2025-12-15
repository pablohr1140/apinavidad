/**
 * # Auth
 * Propósito: Archivo Auth
 * Pertenece a: General
 * Interacciones: N/A
 */
export interface TokenPayload {
    sub: string;
    email: string;
}
export declare abstract class TokenProvider {
    abstract sign(payload: TokenPayload, options?: {
        expiresInMinutes?: number;
    }): Promise<string>;
    abstract verify(token: string): Promise<TokenPayload>;
}
export declare abstract class HashProvider {
    abstract hash(plain: string): Promise<string>;
    abstract compare(plain: string, hash: string): Promise<boolean>;
}
