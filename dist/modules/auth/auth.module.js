"use strict";
/**
 * # auth.module
 * Propósito: Módulo de agregación auth.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */
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
const roles_controller_1 = require("./roles.controller");
const Auth_1 = require("../../application/contracts/Auth");
const UserRepository_1 = require("../../application/repositories/UserRepository");
const LoginUseCase_1 = require("../../application/use-cases/auth/LoginUseCase");
const RefreshTokenUseCase_1 = require("../../application/use-cases/auth/RefreshTokenUseCase");
const PasetoService_1 = require("../../infra/auth/PasetoService");
const PrismaUserRepository_1 = require("../../infra/database/repositories/PrismaUserRepository");
const BcryptProvider_1 = require("../../infra/security/BcryptProvider");
const authorization_service_1 = require("./services/authorization.service");
const role_admin_service_1 = require("./services/role-admin.service");
const logs_module_1 = require("../logs/logs.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [auth_controller_1.AuthController, roles_controller_1.RolesController],
        providers: [
            LoginUseCase_1.LoginUseCase,
            RefreshTokenUseCase_1.RefreshTokenUseCase,
            PasetoService_1.PasetoService,
            BcryptProvider_1.BcryptProvider,
            PrismaUserRepository_1.PrismaUserRepository,
            { provide: UserRepository_1.UserRepository, useExisting: PrismaUserRepository_1.PrismaUserRepository },
            { provide: Auth_1.TokenProvider, useExisting: PasetoService_1.PasetoService },
            { provide: Auth_1.HashProvider, useExisting: BcryptProvider_1.BcryptProvider },
            authorization_service_1.AuthorizationService,
            role_admin_service_1.RoleAdminService
        ],
        exports: [PasetoService_1.PasetoService, authorization_service_1.AuthorizationService, role_admin_service_1.RoleAdminService]
    })
], AuthModule);
