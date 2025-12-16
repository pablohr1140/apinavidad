"use strict";
/**
 * # Refresh Token Use Case
 * Propósito: Caso de uso Refresh Token Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
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
exports.RefreshTokenUseCase = void 0;
/**
 * # RefreshTokenUseCase
 *
 * Propósito: validar refresh token y emitir un nuevo par de tokens.
 * Pertenece a: Application layer.
 * Interacciones: `TokenProvider`.
 */
const common_1 = require("@nestjs/common");
const Auth_1 = require("../../contracts/Auth");
const auth_1 = require("../../../config/auth");
let RefreshTokenUseCase = class RefreshTokenUseCase {
    tokenProvider;
    constructor(tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    /**
     * Verifica el refresh token y genera tokens renovados.
     * @param token - refresh token vigente.
     */
    async execute(token) {
        const payload = await this.tokenProvider.verify(token);
        const newToken = await this.tokenProvider.sign(payload, { expiresInMinutes: auth_1.ACCESS_TOKEN_TTL_MINUTES });
        const newRefresh = await this.tokenProvider.sign(payload, { expiresInMinutes: auth_1.REFRESH_TOKEN_TTL_MINUTES });
        return {
            accessToken: newToken,
            refreshToken: newRefresh
        };
    }
};
exports.RefreshTokenUseCase = RefreshTokenUseCase;
exports.RefreshTokenUseCase = RefreshTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Auth_1.TokenProvider])
], RefreshTokenUseCase);
