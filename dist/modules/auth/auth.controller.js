"use strict";
/**
 * # auth.controller
 * Propósito: Endpoints HTTP de auth.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/**
 * # AuthController
 *
 * Propósito: expone endpoints de login y refresh que delegan en casos de uso y setean cookies.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: `LoginUseCase`, `RefreshTokenUseCase`, cookies de auth.
 */
const common_1 = require("@nestjs/common");
const AuthDTOs_1 = require("../../application/dtos/AuthDTOs");
const LoginUseCase_1 = require("../../application/use-cases/auth/LoginUseCase");
const RefreshTokenUseCase_1 = require("../../application/use-cases/auth/RefreshTokenUseCase");
const auth_1 = require("../../config/auth");
const public_decorator_1 = require("./decorators/public.decorator");
const zod_validation_pipe_1 = require("../shared/pipes/zod-validation.pipe");
let AuthController = class AuthController {
    loginUseCase;
    refreshTokenUseCase;
    constructor(loginUseCase, refreshTokenUseCase) {
        this.loginUseCase = loginUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
    }
    async login(body, res) {
        const result = await this.loginUseCase.execute(body);
        this.setAuthCookies(res, result.accessToken, result.refreshToken);
        return result;
    }
    async refresh(body, req, res) {
        const refreshToken = body.refreshToken ?? req.cookies?.[auth_1.REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) {
            throw new common_1.BadRequestException('Refresh token es requerido');
        }
        const result = await this.refreshTokenUseCase.execute(refreshToken);
        this.setAuthCookies(res, result.accessToken, result.refreshToken);
        return result;
    }
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie(auth_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, (0, auth_1.buildCookieOptions)(auth_1.ACCESS_TOKEN_TTL_MINUTES));
        res.cookie(auth_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, (0, auth_1.buildCookieOptions)(auth_1.REFRESH_TOKEN_TTL_MINUTES));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(AuthDTOs_1.loginSchema))),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(AuthDTOs_1.refreshRequestSchema))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [LoginUseCase_1.LoginUseCase,
        RefreshTokenUseCase_1.RefreshTokenUseCase])
], AuthController);
