"use strict";
/**
 * # List Organizaciones Use Case
 * Propósito: Caso de uso List Organizaciones Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
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
exports.ListOrganizacionesUseCase = void 0;
/**
 * # ListOrganizacionesUseCase
 *
 * Propósito: listar organizaciones filtrando por estado/tipo a través del repositorio inyectado.
 * Pertenece a: Application layer (caso de uso); orquesta dominio <- repositorio.
 * Interacciones: depende de `OrganizacionRepository` (Prisma).
 */
const common_1 = require("@nestjs/common");
const OrganizacionRepository_1 = require("../../repositories/OrganizacionRepository");
let ListOrganizacionesUseCase = class ListOrganizacionesUseCase {
    organizacionRepository;
    constructor(organizacionRepository) {
        this.organizacionRepository = organizacionRepository;
    }
    /**
     * Ejecuta la búsqueda de organizaciones según filtros opcionales (estado, tipo, etc.).
     * @param params - filtros delegados al repositorio.
     * @returns arreglo de organizaciones en formato de dominio.
     */
    execute(params) {
        return this.organizacionRepository.findMany(params);
    }
};
exports.ListOrganizacionesUseCase = ListOrganizacionesUseCase;
exports.ListOrganizacionesUseCase = ListOrganizacionesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [OrganizacionRepository_1.OrganizacionRepository])
], ListOrganizacionesUseCase);
