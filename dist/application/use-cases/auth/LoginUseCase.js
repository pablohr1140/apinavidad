"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
/**
 * # LoginUseCase
 *
 * Propósito: autenticar usuarios, generar tokens y auditar inicio de sesión.
 * Pertenece a: Application layer.
 * Interacciones: `UserRepository`, `HashProvider`, `TokenProvider`, `AppError`, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const AppError_1 = require("../../../shared/errors/AppError");
const AuthDTOs_1 = require("../../dtos/AuthDTOs");
const UserRepository_1 = require("../../repositories/UserRepository");
const Auth_1 = require("../../contracts/Auth");
const auth_1 = require("../../../config/auth");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let LoginUseCase = class LoginUseCase {
    userRepository;
    hashProvider;
    tokenProvider;
    logActivityUseCase;
    constructor(userRepository, hashProvider, tokenProvider, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.tokenProvider = tokenProvider;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida credenciales, genera tokens de acceso/refresh y registra auditoría.
     * @param data - DTO de login a validar.
     */
    async execute(data) {
        const payload = AuthDTOs_1.loginSchema.parse(data);
        const user = await this.userRepository.findByEmail(payload.email);
        if (!user) {
            throw new AppError_1.AppError('Credenciales inválidas', 401);
        }
        const match = await this.hashProvider.compare(payload.password, user.passwordHash);
        if (!match) {
            throw new AppError_1.AppError('Credenciales inválidas', 401);
        }
        const tokenPayload = { sub: user.id.toString(), email: user.email };
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenProvider.sign(tokenPayload, { expiresInMinutes: auth_1.ACCESS_TOKEN_TTL_MINUTES }),
            this.tokenProvider.sign(tokenPayload, { expiresInMinutes: auth_1.REFRESH_TOKEN_TTL_MINUTES })
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
};
exports.LoginUseCase = LoginUseCase;
exports.LoginUseCase = LoginUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository,
        Auth_1.HashProvider,
        Auth_1.TokenProvider,
        LogActivityUseCase_1.LogActivityUseCase])
], LoginUseCase);
