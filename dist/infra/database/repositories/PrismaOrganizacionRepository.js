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
exports.PrismaOrganizacionRepository = void 0;
/**
 * # PrismaOrganizacionRepository
 *
 * Propósito: implementación Prisma de `OrganizacionRepository` para CRUD con manejo de bigint.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `organizaciones`, normaliza ids BigInt a number.
 */
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const AppError_1 = require("../../../shared/errors/AppError");
let PrismaOrganizacionRepository = class PrismaOrganizacionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(params) {
        const where = {};
        if (params?.estado) {
            where.estado = params.estado;
        }
        if (params?.tipo) {
            where.tipo = params.tipo;
        }
        const organizaciones = await this.prisma.organizaciones
            .findMany({
            where,
            orderBy: { created_at: 'desc' }
        })
            .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('PrismaOrganizacionRepository.findMany error', { where, error });
            throw error;
        });
        return organizaciones.map((organizacion) => this.toDomain(organizacion));
    }
    async findById(id) {
        const organizacion = await this.prisma.organizaciones
            .findUnique({ where: { id } })
            .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('PrismaOrganizacionRepository.findById error', { id, error });
            throw error;
        });
        return organizacion ? this.toDomain(organizacion) : null;
    }
    async create(data) {
        const created = await this.prisma.organizaciones.create({
            data: this.mapCreateData(data)
        });
        return this.toDomain(created);
    }
    async update(id, data) {
        const updated = await this.prisma.organizaciones
            .update({
            where: { id },
            data: this.mapUpdateData(data)
        })
            .catch((error) => {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new AppError_1.AppError('Organización no encontrada', 404);
            }
            throw error;
        });
        return this.toDomain(updated);
    }
    async delete(id) {
        await this.prisma.organizaciones.delete({ where: { id } });
    }
    toDomain(organizacion) {
        return {
            // Prisma returns SQL Server bigint columns as JS BigInt; normalize to number for JSON serialization
            id: Number(organizacion.id),
            nombre: organizacion.nombre,
            sigla: organizacion.sigla ?? undefined,
            rut: organizacion.rut ?? undefined,
            tipo: organizacion.tipo,
            direccion: organizacion.direccion ?? undefined,
            telefono: organizacion.telefono ?? undefined,
            email: organizacion.email ?? undefined,
            providenciaId: organizacion.providencia_id ?? undefined,
            estado: organizacion.estado,
            createdAt: organizacion.created_at,
            updatedAt: organizacion.updated_at
        };
    }
    mapCreateData(data) {
        return {
            nombre: data.nombre,
            sigla: data.sigla ?? null,
            rut: data.rut ?? null,
            tipo: data.tipo,
            direccion: data.direccion ?? null,
            telefono: data.telefono ?? null,
            email: data.email ?? null,
            providencia_id: data.providenciaId ?? null,
            estado: data.estado
        };
    }
    mapUpdateData(data) {
        const payload = {};
        if (data.nombre !== undefined)
            payload.nombre = data.nombre;
        if (data.sigla !== undefined)
            payload.sigla = data.sigla;
        if (data.rut !== undefined)
            payload.rut = data.rut;
        if (data.tipo !== undefined)
            payload.tipo = data.tipo;
        if (data.direccion !== undefined)
            payload.direccion = data.direccion;
        if (data.telefono !== undefined)
            payload.telefono = data.telefono;
        if (data.email !== undefined)
            payload.email = data.email;
        if (data.providenciaId !== undefined)
            payload.providencia_id = data.providenciaId;
        if (data.estado !== undefined)
            payload.estado = data.estado;
        return payload;
    }
};
exports.PrismaOrganizacionRepository = PrismaOrganizacionRepository;
exports.PrismaOrganizacionRepository = PrismaOrganizacionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaOrganizacionRepository);
