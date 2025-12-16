"use strict";
/**
 * # Prisma Periodo Repository
 * Propósito: Repositorio Prisma Prisma Periodo Repository
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
exports.PrismaPeriodoRepository = void 0;
/**
 * # PrismaPeriodoRepository
 *
 * Propósito: implementación Prisma de `PeriodoRepository` para CRUD y cambios de estado.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `periodos`, transacción para activar periodo único.
 */
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PrismaPeriodoRepository = class PrismaPeriodoRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(params) {
        const where = {
            ...(params?.estado ? { estado_periodo: params.estado } : {}),
            ...(params?.activo !== undefined ? { es_activo: params.activo } : {})
        };
        const periodos = await this.prisma.periodos.findMany({ where, orderBy: { created_at: 'desc' } });
        return periodos.map((periodo) => this.toDomain(periodo));
    }
    async findById(id) {
        const periodo = await this.prisma.periodos.findUnique({ where: { id } });
        return periodo ? this.toDomain(periodo) : null;
    }
    async findOverlapping(params) {
        const start = params.start ?? new Date('0001-01-01');
        const end = params.end ?? new Date('9999-12-31');
        const overlap = await this.prisma.periodos.findFirst({
            where: {
                ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
                NOT: [{ fecha_inicio: { gt: end } }, { fecha_fin: { lt: start } }]
            },
            orderBy: { id: 'asc' }
        });
        return overlap ? this.toDomain(overlap) : null;
    }
    async create(data) {
        const created = await this.prisma.periodos.create({ data: this.mapCreateData(data) });
        return this.toDomain(created);
    }
    async update(id, data) {
        const updated = await this.prisma.periodos.update({ where: { id }, data: this.mapUpdateData(data) });
        return this.toDomain(updated);
    }
    async open(id) {
        const updated = await this.prisma.$transaction(async (tx) => {
            // Garantiza un único periodo abierto: cierra y desactiva los demás antes de abrir este
            await tx.periodos.updateMany({
                where: { id: { not: id }, estado_periodo: 'abierto' },
                data: { estado_periodo: 'cerrado', es_activo: false }
            });
            return tx.periodos.update({ where: { id }, data: { estado_periodo: 'abierto', es_activo: true } });
        });
        return this.toDomain(updated);
    }
    async close(id) {
        const updated = await this.prisma.periodos.update({ where: { id }, data: { estado_periodo: 'cerrado', es_activo: false } });
        return this.toDomain(updated);
    }
    /** Desactiva todos y activa el periodo dado dentro de una transacción. */
    async activate(id) {
        const periodo = await this.prisma.$transaction(async (tx) => {
            // Desactiva y cierra cualquier otro abierto antes de activar este
            await tx.periodos.updateMany({ data: { es_activo: false, estado_periodo: 'cerrado' }, where: { id: { not: id } } });
            return tx.periodos.update({ where: { id }, data: { es_activo: true, estado_periodo: 'abierto' } });
        });
        return this.toDomain(periodo);
    }
    mapCreateData(data) {
        return {
            nombre: data.nombre,
            fecha_inicio: data.fecha_inicio ?? null,
            fecha_fin: data.fecha_fin ?? null,
            estado_periodo: data.estado_periodo,
            es_activo: data.es_activo
        };
    }
    mapUpdateData(data) {
        const payload = {};
        if (data.nombre !== undefined)
            payload.nombre = data.nombre;
        if (data.fecha_inicio !== undefined)
            payload.fecha_inicio = data.fecha_inicio ?? null;
        if (data.fecha_fin !== undefined)
            payload.fecha_fin = data.fecha_fin ?? null;
        if (data.estado_periodo !== undefined)
            payload.estado_periodo = data.estado_periodo;
        if (data.es_activo !== undefined)
            payload.es_activo = data.es_activo;
        return payload;
    }
    toDomain(entity) {
        return {
            id: entity.id,
            nombre: entity.nombre,
            fecha_inicio: entity.fecha_inicio ? new Date(entity.fecha_inicio) : undefined,
            fecha_fin: entity.fecha_fin ? new Date(entity.fecha_fin) : undefined,
            estado_periodo: entity.estado_periodo,
            es_activo: Boolean(entity.es_activo),
            createdAt: entity.created_at ?? new Date(),
            updatedAt: entity.updated_at ?? new Date()
        };
    }
};
exports.PrismaPeriodoRepository = PrismaPeriodoRepository;
exports.PrismaPeriodoRepository = PrismaPeriodoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPeriodoRepository);
