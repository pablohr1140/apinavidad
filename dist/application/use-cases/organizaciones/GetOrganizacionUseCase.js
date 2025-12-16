"use strict";
/**
 * # Get Organizacion Use Case
 * Propósito: Caso de uso Get Organizacion Use Case
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
exports.GetOrganizacionUseCase = void 0;
/**
 * # GetOrganizacionUseCase
 *
 * Propósito: obtener una organización por id, validando existencia.
 * Pertenece a: Application layer (caso de uso).
 * Interacciones: depende de `OrganizacionRepository` y usa `AppError` para 404.
 */
const common_1 = require("@nestjs/common");
const OrganizacionRepository_1 = require("../../repositories/OrganizacionRepository");
const AppError_1 = require("../../../shared/errors/AppError");
let GetOrganizacionUseCase = class GetOrganizacionUseCase {
    organizacionRepository;
    constructor(organizacionRepository) {
        this.organizacionRepository = organizacionRepository;
    }
    /**
     * Busca una organización por id; lanza 404 si no existe.
     * @param id - identificador numérico de la organización.
     * @returns organización de dominio.
     */
    async execute(id) {
        const organizacion = await this.organizacionRepository.findById(id);
        if (!organizacion) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        return organizacion;
    }
};
exports.GetOrganizacionUseCase = GetOrganizacionUseCase;
exports.GetOrganizacionUseCase = GetOrganizacionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [OrganizacionRepository_1.OrganizacionRepository])
], GetOrganizacionUseCase);
