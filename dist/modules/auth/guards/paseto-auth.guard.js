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
exports.PasetoAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const PasetoService_1 = require("../../../infra/auth/PasetoService");
const public_decorator_1 = require("../decorators/public.decorator");
const auth_1 = require("../../../config/auth");
const authorization_service_1 = require("../services/authorization.service");
let PasetoAuthGuard = class PasetoAuthGuard {
    pasetoService;
    authorizationService;
    reflector;
    constructor(reflector, pasetoService, authorizationService) {
        this.pasetoService = pasetoService;
        this.authorizationService = authorizationService;
        this.reflector = reflector ?? new core_1.Reflector();
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const header = request.headers.authorization;
        const tokenFromHeader = header?.startsWith('Bearer ')
            ? header.split(' ')[1]
            : undefined;
        const tokenFromCookie = request.cookies?.[auth_1.ACCESS_TOKEN_COOKIE_NAME];
        const token = tokenFromHeader ?? tokenFromCookie;
        if (!token) {
            throw new common_1.UnauthorizedException('Falta token de autenticación');
        }
        try {
            const payload = await this.pasetoService.verify(token);
            const userId = Number(payload.sub);
            if (Number.isNaN(userId)) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            const authUser = await this.authorizationService.buildUserContext(userId, payload.email);
            Object.assign(request, { user: authUser });
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
};
exports.PasetoAuthGuard = PasetoAuthGuard;
exports.PasetoAuthGuard = PasetoAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        PasetoService_1.PasetoService,
        authorization_service_1.AuthorizationService])
], PasetoAuthGuard);
