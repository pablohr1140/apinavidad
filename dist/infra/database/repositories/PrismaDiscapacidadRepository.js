"use strict";
/**
 * # Prisma Discapacidad Repository
 * Propósito: Repositorio Prisma Prisma Discapacidad Repository
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
exports.PrismaDiscapacidadRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PrismaDiscapacidadRepository = class PrismaDiscapacidadRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(params) {
        const discapacidades = await this.prisma.discapacidades.findMany({
            where: params?.activo !== undefined ? { activo: params.activo } : {},
            orderBy: { created_at: 'desc' }
        });
        return discapacidades.map((d) => this.toDomain(d));
    }
    async create(data) {
        const created = await this.prisma.discapacidades.create({
            data: {
                nombre: data.nombre,
                activo: data.activo
            }
        });
        return this.toDomain(created);
    }
    toDomain(entity) {
        return {
            id: entity.id,
            nombre: entity.nombre,
            categoria: undefined,
            codigo: undefined,
            descripcion: undefined,
            activo: Boolean(entity.activo),
            createdAt: entity.created_at ?? new Date(),
            updatedAt: entity.updated_at ?? new Date()
        };
    }
};
exports.PrismaDiscapacidadRepository = PrismaDiscapacidadRepository;
exports.PrismaDiscapacidadRepository = PrismaDiscapacidadRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDiscapacidadRepository);
