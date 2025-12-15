/**
 * # auth.controller
 * Propósito: Endpoints HTTP de auth.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import type { Response, Request } from 'express';
import { type LoginDTO, type RefreshRequestDTO } from '@/application/dtos/AuthDTOs';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
export declare class AuthController {
    private readonly loginUseCase;
    private readonly refreshTokenUseCase;
    constructor(loginUseCase: LoginUseCase, refreshTokenUseCase: RefreshTokenUseCase);
    login(body: LoginDTO, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: ("SUPERADMIN" | "ADMIN" | "DIDECO" | "REPRESENTANTE" | "PROVIDENCIA")[];
        };
    }>;
    refresh(body: RefreshRequestDTO, req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private setAuthCookies;
}
