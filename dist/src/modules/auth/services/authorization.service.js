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
exports.AuthorizationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const redis_service_1 = require("../../../infra/cache/redis.service");
const ROLE_CACHE_PREFIX = 'role-permissions:';
const ROLE_CACHE_TTL_SECONDS = 60 * 10; // 10 minutos
let AuthorizationService = class AuthorizationService {
    prisma;
    redisService;
    constructor(prisma, redisService) {
        this.prisma = prisma;
        this.redisService = redisService;
    }
    async buildUserContext(userId, fallbackEmail) {
        const persona = await this.prisma.personas.findUnique({
            where: { id: userId },
            include: { roles: true }
        });
        if (!persona) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const roleSummaries = persona.roles
            ? [persona.roles].filter(Boolean).map((role) => ({
                id: role.id,
                key: role.role_key,
                name: role.name,
                rank: role.rank
            }))
            : [];
        const permissions = await this.aggregatePermissions(roleSummaries.map((role) => role.key));
        return {
            id: persona.id,
            email: persona.email ?? fallbackEmail ?? '',
            roles: roleSummaries,
            permissions
        };
    }
    async invalidateRoleCache(roleKey) {
        await this.redisService.del(`${ROLE_CACHE_PREFIX}${roleKey}`);
    }
    async aggregatePermissions(roleKeys) {
        const codes = new Set();
        const uniqueKeys = Array.from(new Set(roleKeys));
        for (const key of uniqueKeys) {
            const rolePermissions = await this.resolveRolePermissions(key);
            rolePermissions.forEach((perm) => codes.add(perm));
        }
        return codes;
    }
    async resolveRolePermissions(roleKey) {
        const cacheKey = `${ROLE_CACHE_PREFIX}${roleKey}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            try {
                return JSON.parse(cached);
            }
            catch {
                // ignore cache parsing errors and rebuild payload
            }
        }
        const role = await this.prisma.roles.findUnique({
            where: { role_key: roleKey },
            include: {
                role_permissions: {
                    include: {
                        permissions: true
                    }
                }
            }
        });
        if (!role) {
            return [];
        }
        const permissions = (role.role_permissions ?? []).map((permission) => `${permission.permissions.resource}.${permission.permissions.action}`);
        await this.redisService.set(cacheKey, JSON.stringify(permissions), ROLE_CACHE_TTL_SECONDS);
        return permissions;
    }
};
exports.AuthorizationService = AuthorizationService;
exports.AuthorizationService = AuthorizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AuthorizationService);
