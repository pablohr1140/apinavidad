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
exports.CreateOrganizacionConProvidenciaUseCase = void 0;
const common_1 = require("@nestjs/common");
const OrganizacionDTOs_1 = require("../../dtos/OrganizacionDTOs");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const AppError_1 = require("../../../shared/errors/AppError");
let CreateOrganizacionConProvidenciaUseCase = class CreateOrganizacionConProvidenciaUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(data) {
        const payload = OrganizacionDTOs_1.createOrganizacionConProvidenciaSchema.parse(data);
        const codigo = payload.providencia.codigo.trim().toUpperCase();
        const nombreProvidencia = payload.providencia.nombre.trim();
        const nombreOrg = payload.organizacion.nombre.trim();
        return this.prisma.$transaction(async (tx) => {
            const providencia = await tx.providencias.upsert({
                where: { codigo },
                update: { nombre: nombreProvidencia, codigo, activo: true },
                create: { nombre: nombreProvidencia, codigo, activo: true }
            }).catch((error) => {
                if (error instanceof Error) {
                    throw new AppError_1.AppError(`Error creando/actualizando providencia: ${error.message}`, 400);
                }
                throw error;
            });
            const org = await tx.organizaciones.create({
                data: {
                    nombre: nombreOrg,
                    tipo: 'Providencia',
                    direccion: payload.organizacion.direccion ?? null,
                    telefono: payload.organizacion.telefono ?? null,
                    email: payload.organizacion.email ?? null,
                    providencia_id: providencia.id,
                    sector_id: payload.organizacion.sectorId ?? null,
                    estado: payload.organizacion.estado ?? 'borrador'
                }
            });
            return {
                id: Number(org.id),
                nombre: org.nombre,
                tipo: org.tipo,
                direccion: org.direccion ?? undefined,
                telefono: org.telefono ?? undefined,
                email: org.email ?? undefined,
                providenciaId: org.providencia_id ?? undefined,
                sectorId: org.sector_id ?? undefined,
                estado: org.estado,
                createdAt: org.created_at,
                updatedAt: org.updated_at,
                providencia: {
                    id: providencia.id,
                    nombre: providencia.nombre,
                    codigo: providencia.codigo ?? undefined,
                    activo: providencia.activo,
                    createdAt: providencia.created_at,
                    updatedAt: providencia.updated_at
                }
            };
        });
    }
};
exports.CreateOrganizacionConProvidenciaUseCase = CreateOrganizacionConProvidenciaUseCase;
exports.CreateOrganizacionConProvidenciaUseCase = CreateOrganizacionConProvidenciaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CreateOrganizacionConProvidenciaUseCase);
