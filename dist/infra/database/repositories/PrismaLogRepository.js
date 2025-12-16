"use strict";
/**
 * # Prisma Log Repository
 * Propósito: Repositorio Prisma Prisma Log Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
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
exports.PrismaLogRepository = void 0;
/**
 * # PrismaLogRepository
 *
 * Propósito: implementación Prisma de `LogRepository` para persistir auditoría.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `logs`, serializa payload a JSON.
 */
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PrismaLogRepository = class PrismaLogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const created = await this.prisma.logs.create({ data: this.toPersistence(data) });
        return this.toDomain(created);
    }
    toPersistence(data) {
        return {
            user_id: data.personaId ?? null,
            accion: data.accion,
            mensaje: data.mensaje ?? null,
            loggable_id: BigInt(data.loggableId),
            loggable_type: data.loggableType,
            payload: data.payload ? JSON.stringify(data.payload) : null,
            ip: data.ip ?? null,
            user_agent: data.user_agent ?? null
        };
    }
    toDomain(entity) {
        return {
            id: entity.id,
            personaId: entity.user_id ?? undefined,
            accion: entity.accion,
            mensaje: entity.mensaje ?? undefined,
            loggableId: Number(entity.loggable_id),
            loggableType: entity.loggable_type,
            payload: entity.payload ? JSON.parse(entity.payload) : null,
            ip: entity.ip ?? undefined,
            user_agent: entity.user_agent ?? undefined,
            createdAt: entity.created_at ?? new Date(),
            updatedAt: entity.updated_at ?? new Date()
        };
    }
};
exports.PrismaLogRepository = PrismaLogRepository;
exports.PrismaLogRepository = PrismaLogRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaLogRepository);
