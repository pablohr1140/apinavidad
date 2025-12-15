"use strict";
/**
 * # Prisma Persona Repository
 * Propósito: Repositorio Prisma Prisma Persona Repository
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
exports.PrismaPersonaRepository = void 0;
/**
 * # PrismaPersonaRepository
 *
 * Propósito: implementación Prisma de `PersonaRepository` con soporte de búsqueda y asignación de roles.
 * Pertenece a: Infra/database.
 * Interacciones: tablas `personas` y `roles`; maneja compatibilidad case-insensitive por driver.
 */
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const AppError_1 = require("../../../shared/errors/AppError");
const PERSONA_INCLUDE = {
    roles: true
};
const supportsCaseInsensitive = () => {
    const url = process.env.DATABASE_URL?.toLowerCase() ?? '';
    return !url.startsWith('sqlserver:');
};
const buildContainsFilter = (value) => supportsCaseInsensitive() ? { contains: value, mode: 'insensitive' } : { contains: value };
let PrismaPersonaRepository = class PrismaPersonaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(params) {
        const where = {};
        if (params?.organizacionId) {
            where.organizacion_persona = {
                some: { organizacion_id: params.organizacionId }
            };
        }
        if (params?.search?.trim()) {
            const value = params.search.trim();
            where.OR = [
                { nombres: buildContainsFilter(value) },
                { apellidos: buildContainsFilter(value) },
                { run: buildContainsFilter(value) }
            ];
        }
        const personas = await this.prisma.personas.findMany({
            where,
            include: PERSONA_INCLUDE,
            orderBy: { created_at: 'desc' }
        });
        return personas.map((persona) => this.toDomain(persona));
    }
    /** Recupera persona por id incluyendo rol. */
    async findById(id) {
        const persona = await this.prisma.personas.findUnique({
            where: { id },
            include: PERSONA_INCLUDE
        });
        return persona ? this.toDomain(persona) : null;
    }
    async create(data) {
        const { roleKeys, roleId, ...writeData } = data;
        const resolvedRoleId = await this.resolveRoleId(roleKeys, roleId);
        const persona = await this.prisma.personas.create({
            data: {
                ...this.mapCreateData(writeData),
                role_id: resolvedRoleId ?? null
            },
            include: PERSONA_INCLUDE
        });
        return this.toDomain(persona);
    }
    async update(id, data) {
        const { roleKeys, roleId, ...writeData } = data;
        const resolvedRoleId = await this.resolveRoleId(roleKeys, roleId);
        const persona = await this.prisma.personas
            .update({
            where: { id },
            data: {
                ...this.mapUpdateData(writeData),
                role_id: resolvedRoleId === undefined ? undefined : resolvedRoleId
            },
            include: PERSONA_INCLUDE
        })
            .catch((error) => {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new AppError_1.AppError('Persona no encontrada', 404);
            }
            throw error;
        });
        return this.toDomain(persona);
    }
    async delete(id) {
        await this.prisma.personas.delete({ where: { id } });
    }
    toDomain(persona) {
        return {
            id: persona.id,
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            run: persona.run ?? undefined,
            dv: persona.dv ?? undefined,
            fecha_nacimiento: persona.fecha_nacimiento ?? undefined,
            sexo: persona.sexo ?? undefined,
            telefono: persona.telefono ?? undefined,
            email: persona.email ?? undefined,
            email_verified_at: persona.email_verified_at ?? undefined,
            password: persona.password ?? undefined,
            rememberToken: persona.remember_token ?? undefined,
            direccion: persona.direccion ?? undefined,
            providenciaId: persona.providencia_id ?? undefined,
            esRepresentante: persona.es_representante,
            roles: persona.roles
                ? [
                    {
                        id: persona.roles.id,
                        key: persona.roles.role_key,
                        name: persona.roles.name,
                        rank: persona.roles.rank
                    }
                ]
                : [],
            createdAt: persona.created_at,
            updatedAt: persona.updated_at
        };
    }
    mapCreateData(data) {
        return {
            nombres: data.nombres,
            apellidos: data.apellidos,
            run: data.run ?? null,
            dv: data.dv ?? null,
            fecha_nacimiento: data.fecha_nacimiento ?? null,
            sexo: data.sexo ?? null,
            telefono: data.telefono ?? null,
            email: data.email ?? null,
            email_verified_at: data.email_verified_at ?? null,
            password: data.password ?? null,
            remember_token: data.rememberToken ?? null,
            direccion: data.direccion ?? null,
            providencia_id: data.providenciaId ?? null,
            es_representante: data.esRepresentante
        };
    }
    mapUpdateData(data) {
        const payload = {};
        if (data.nombres !== undefined)
            payload.nombres = data.nombres;
        if (data.apellidos !== undefined)
            payload.apellidos = data.apellidos;
        if (data.run !== undefined)
            payload.run = data.run;
        if (data.dv !== undefined)
            payload.dv = data.dv;
        if (data.fecha_nacimiento !== undefined)
            payload.fecha_nacimiento = data.fecha_nacimiento;
        if (data.sexo !== undefined)
            payload.sexo = data.sexo;
        if (data.telefono !== undefined)
            payload.telefono = data.telefono;
        if (data.email !== undefined)
            payload.email = data.email;
        if (data.email_verified_at !== undefined)
            payload.email_verified_at = data.email_verified_at;
        if (data.password !== undefined)
            payload.password = data.password;
        if (data.rememberToken !== undefined)
            payload.remember_token = data.rememberToken;
        if (data.direccion !== undefined)
            payload.direccion = data.direccion;
        if (data.providenciaId !== undefined)
            payload.providencia_id = data.providenciaId;
        if (data.esRepresentante !== undefined)
            payload.es_representante = data.esRepresentante;
        return payload;
    }
    async resolveRoleId(roleKeys, roleId) {
        if (roleId !== undefined) {
            return roleId;
        }
        if (!roleKeys) {
            return undefined;
        }
        const uniqueKeys = Array.from(new Set(roleKeys));
        if (uniqueKeys.length === 0) {
            return null;
        }
        if (uniqueKeys.length > 1) {
            throw new AppError_1.AppError('Solo se permite un rol por persona', 400);
        }
        const role = await this.prisma.roles.findUnique({ where: { role_key: uniqueKeys[0] } });
        if (!role) {
            throw new AppError_1.AppError(`Rol no válido: ${uniqueKeys[0]}`, 400);
        }
        return role.id;
    }
};
exports.PrismaPersonaRepository = PrismaPersonaRepository;
exports.PrismaPersonaRepository = PrismaPersonaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPersonaRepository);
