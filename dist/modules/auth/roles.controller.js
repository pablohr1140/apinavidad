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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const auth_user_decorator_1 = require("./decorators/auth-user.decorator");
const role_admin_service_1 = require("./services/role-admin.service");
let RolesController = class RolesController {
    roleAdminService;
    constructor(roleAdminService) {
        this.roleAdminService = roleAdminService;
    }
    async deleteRole(roleKey, user) {
        const actorRoleKey = user?.roles?.[0]?.key;
        if (!actorRoleKey) {
            // El guard debería poblar user; si no, es un fallo de auth.
            throw new common_1.UnauthorizedException('Falta rol del actor en el contexto de autenticación');
        }
        await this.roleAdminService.deleteRole(actorRoleKey, roleKey);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Delete)(':roleKey'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('roleKey')),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "deleteRole", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [role_admin_service_1.RoleAdminService])
], RolesController);
