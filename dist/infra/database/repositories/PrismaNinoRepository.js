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
exports.PrismaNinoRepository = void 0;
/**
 * # PrismaNinoRepository
 *
 * Propósito: implementación Prisma de `NinoRepository` incluyendo reglas de auto-inhabilitación.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `ninos`, reglas de negocio de edad, BigInt para claves foráneas.
 */
const common_1 = require("@nestjs/common");
const ninoRules_1 = require("../../../domain/services/ninoRules");
const prisma_service_1 = require("../prisma/prisma.service");
const AppError_1 = require("../../../shared/errors/AppError");
const toBigInt = (value) => (value === undefined || value === null ? null : BigInt(value));
const toDate = (value) => (value ? new Date(value) : undefined);
let PrismaNinoRepository = class PrismaNinoRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(params) {
        const where = {};
        if (params?.periodoId !== undefined) {
            where.periodo_id = params.periodoId;
        }
        if (params?.organizacionId !== undefined) {
            where.organizacion_id = toBigInt(params.organizacionId);
        }
        if (params?.estado) {
            where.estado = params.estado;
        }
        if (params?.edadMin !== undefined || params?.edadMax !== undefined) {
            const min = params.edadMin ?? 0;
            const max = params.edadMax ?? ninoRules_1.MAX_EDAD;
            where.edad = { gte: min, lte: max };
        }
        // Nota: el filtro por prioridad se omite porque el esquema Prisma no expone dicho campo.
        const records = await this.prisma.ninos.findMany({ where, orderBy: { created_at: 'desc' } });
        return records.map((record) => this.toDomain(record));
    }
    async findById(id) {
        const nino = await this.prisma.ninos.findUnique({ where: { id: BigInt(id) } });
        return nino ? this.toDomain(nino) : null;
    }
    async create(data) {
        const created = await this.prisma.ninos.create({
            data: this.mapCreateData(data)
        });
        return this.toDomain(created);
    }
    async update(id, data) {
        const updated = await this.prisma.ninos.update({
            where: { id: BigInt(id) },
            data: this.mapUpdateData(data)
        });
        return this.toDomain(updated);
    }
    async inhabilitar(id, payload) {
        const nino = await this.prisma.ninos.findUnique({ where: { id: BigInt(id) } });
        if (!nino) {
            throw new AppError_1.AppError('Niño no encontrado', 404);
        }
        if (nino.fecha_ingreso && payload.fecha < nino.fecha_ingreso) {
            throw new AppError_1.AppError('La fecha no puede ser anterior al ingreso', 400);
        }
        const updated = await this.prisma.ninos.update({
            where: { id: nino.id },
            data: { estado: 'inhabilitado', fecha_retiro: payload.fecha }
        });
        return this.toDomain(updated);
    }
    async restaurar(id) {
        const updated = await this.prisma.ninos.update({
            where: { id: BigInt(id) },
            data: { estado: 'registrado', fecha_retiro: null }
        });
        return this.toDomain(updated);
    }
    async autoInhabilitar(fechaReferencia, dryRun = false) {
        const candidatos = await this.prisma.ninos.findMany({ where: { estado: { not: 'inhabilitado' } } });
        const candidatosDomain = candidatos.map((record) => this.toDomain(record));
        const porInhabilitar = candidatosDomain.filter((nino) => {
            const nacimiento = nino.fecha_nacimiento;
            if (!nacimiento)
                return false;
            const edad = (0, ninoRules_1.calcularEdad)(nacimiento, fechaReferencia);
            return edad !== null && edad >= ninoRules_1.MAX_EDAD;
        });
        if (dryRun) {
            return { afectados: porInhabilitar.length, detalles: porInhabilitar };
        }
        await this.prisma.$transaction(async (tx) => {
            await Promise.all(porInhabilitar.map((nino) => tx.ninos.update({ where: { id: BigInt(nino.id) }, data: (0, ninoRules_1.prepararInhabilitacion)(nino, fechaReferencia) })));
        });
        return { afectados: porInhabilitar.length };
    }
    mapCreateData(data) {
        return {
            nombres: data.nombres,
            apellidos: data.apellidos ?? null,
            run: data.run ?? null,
            dv: data.dv ?? null,
            documento: data.documento ?? null,
            fecha_nacimiento: data.fecha_nacimiento ?? null,
            sexo: data.sexo ?? null,
            organizacion_id: toBigInt(data.organizacionId),
            periodo_id: data.periodoId,
            providencia_id: data.providenciaId ?? null,
            edad: data.edad ?? null,
            tiene_discapacidad: data.tiene_discapacidad,
            fecha_ingreso: data.fecha_ingreso ?? null,
            fecha_retiro: data.fecha_retiro ?? null,
            estado: data.estado
        };
    }
    mapUpdateData(data) {
        const payload = {};
        if (data.nombres !== undefined)
            payload.nombres = data.nombres;
        if (data.apellidos !== undefined)
            payload.apellidos = data.apellidos ?? null;
        if (data.run !== undefined)
            payload.run = data.run ?? null;
        if (data.dv !== undefined)
            payload.dv = data.dv ?? null;
        if (data.documento !== undefined)
            payload.documento = data.documento ?? null;
        if (data.fecha_nacimiento !== undefined)
            payload.fecha_nacimiento = data.fecha_nacimiento ?? null;
        if (data.sexo !== undefined)
            payload.sexo = data.sexo ?? null;
        if (data.organizacionId !== undefined)
            payload.organizacion_id = toBigInt(data.organizacionId);
        if (data.periodoId !== undefined)
            payload.periodo_id = data.periodoId;
        if (data.providenciaId !== undefined)
            payload.providencia_id = data.providenciaId ?? null;
        if (data.edad !== undefined)
            payload.edad = data.edad ?? null;
        if (data.tiene_discapacidad !== undefined)
            payload.tiene_discapacidad = data.tiene_discapacidad;
        if (data.fecha_ingreso !== undefined)
            payload.fecha_ingreso = data.fecha_ingreso ?? null;
        if (data.fecha_retiro !== undefined)
            payload.fecha_retiro = data.fecha_retiro ?? null;
        if (data.estado !== undefined)
            payload.estado = data.estado;
        return payload;
    }
    toDomain(entity) {
        return {
            id: Number(entity.id),
            nombres: entity.nombres,
            apellidos: entity.apellidos ?? undefined,
            run: entity.run ?? undefined,
            dv: entity.dv ?? undefined,
            documento: entity.documento ?? undefined,
            fecha_nacimiento: toDate(entity.fecha_nacimiento),
            sexo: entity.sexo ?? undefined,
            organizacionId: entity.organizacion_id !== null && entity.organizacion_id !== undefined ? Number(entity.organizacion_id) : undefined,
            periodoId: Number(entity.periodo_id),
            providenciaId: entity.providencia_id ?? undefined,
            edad: entity.edad ?? undefined,
            tiene_discapacidad: Boolean(entity.tiene_discapacidad),
            fecha_ingreso: toDate(entity.fecha_ingreso),
            fecha_retiro: toDate(entity.fecha_retiro),
            estado: entity.estado,
            createdAt: toDate(entity.created_at) ?? new Date(),
            updatedAt: toDate(entity.updated_at) ?? new Date()
        };
    }
};
exports.PrismaNinoRepository = PrismaNinoRepository;
exports.PrismaNinoRepository = PrismaNinoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaNinoRepository);
