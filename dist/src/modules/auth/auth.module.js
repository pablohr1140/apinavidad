"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const LoginUseCase_1 = require("../../application/use-cases/auth/LoginUseCase");
const RefreshTokenUseCase_1 = require("../../application/use-cases/auth/RefreshTokenUseCase");
const UserRepository_1 = require("../../application/repositories/UserRepository");
const PrismaUserRepository_1 = require("../../infra/database/repositories/PrismaUserRepository");
const PasetoService_1 = require("../../infra/auth/PasetoService");
const BcryptProvider_1 = require("../../infra/security/BcryptProvider");
const Auth_1 = require("../../application/contracts/Auth");
const authorization_service_1 = require("./services/authorization.service");
const logs_module_1 = require("../logs/logs.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [auth_controller_1.AuthController],
        providers: [
            LoginUseCase_1.LoginUseCase,
            RefreshTokenUseCase_1.RefreshTokenUseCase,
            PasetoService_1.PasetoService,
            BcryptProvider_1.BcryptProvider,
            PrismaUserRepository_1.PrismaUserRepository,
            { provide: UserRepository_1.UserRepository, useExisting: PrismaUserRepository_1.PrismaUserRepository },
            { provide: Auth_1.TokenProvider, useExisting: PasetoService_1.PasetoService },
            { provide: Auth_1.HashProvider, useExisting: BcryptProvider_1.BcryptProvider },
            authorization_service_1.AuthorizationService
        ],
        exports: [PasetoService_1.PasetoService, authorization_service_1.AuthorizationService]
    })
], AuthModule);
