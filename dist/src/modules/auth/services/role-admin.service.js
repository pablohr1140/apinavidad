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
exports.RoleAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const authorization_service_1 = require("./authorization.service");
let RoleAdminService = class RoleAdminService {
    prisma;
    authorization;
    constructor(prisma, authorization) {
        this.prisma = prisma;
        this.authorization = authorization;
    }
    /**
     * Elimina un rol tras validar jerarquía por rank.
     * Si el rol objetivo no existe, simplemente retorna.
     */
    async deleteRole(actorRoleKey, targetRoleKey) {
        // Verifica jerarquía (lanza Forbidden si target >= actor)
        await this.authorization.assertCanDeleteRole(actorRoleKey, targetRoleKey);
        // Elimina el rol (role_permissions se borran en cascada por FK)
        const deleted = await this.prisma.roles.delete({ where: { role_key: targetRoleKey } }).catch((err) => {
            // Si no existe, retornamos sin error; otros errores se propagan.
            if (err.code === 'P2025')
                return null;
            throw err;
        });
        if (!deleted)
            return;
        // Invalida caché de permisos del rol eliminado
        await this.authorization.invalidateRoleCache(targetRoleKey);
    }
};
exports.RoleAdminService = RoleAdminService;
exports.RoleAdminService = RoleAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        authorization_service_1.AuthorizationService])
], RoleAdminService);
