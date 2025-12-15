/**
 * # Refresh Token Use Case
 * Propósito: Caso de uso Refresh Token Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { TokenProvider } from '@/application/contracts/Auth';
export declare class RefreshTokenUseCase {
    private readonly tokenProvider;
    constructor(tokenProvider: TokenProvider);
    /**
     * Verifica el refresh token y genera tokens renovados.
     * @param token - refresh token vigente.
     */
    execute(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
