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
