/**
 * # Login Use Case
 * Propósito: Caso de uso Login Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { HashProvider, TokenProvider } from '@/application/contracts/Auth';
import { LoginDTO } from '@/application/dtos/AuthDTOs';
import { UserRepository } from '@/application/repositories/UserRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly hashProvider;
    private readonly tokenProvider;
    private readonly logActivityUseCase;
    constructor(userRepository: UserRepository, hashProvider: HashProvider, tokenProvider: TokenProvider, logActivityUseCase?: LogActivityUseCase);
    /**
     * Valida credenciales, genera tokens de acceso/refresh y registra auditoría.
     * @param data - DTO de login a validar.
     */
    execute(data: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: ("SUPERADMIN" | "ADMIN" | "DIDECO" | "REPRESENTANTE" | "PROVIDENCIA")[];
        };
    }>;
}
