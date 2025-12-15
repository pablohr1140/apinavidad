"use strict";
/**
 * # Update Organizacion Use Case
 * Propósito: Caso de uso Update Organizacion Use Case
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
exports.UpdateOrganizacionUseCase = void 0;
/**
 * # UpdateOrganizacionUseCase
 *
 * Propósito: actualizar organizaciones tras validar existencia y payload, registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `OrganizacionRepository`, `updateOrganizacionSchema`, `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const OrganizacionDTOs_1 = require("../../dtos/OrganizacionDTOs");
const OrganizacionRepository_1 = require("../../repositories/OrganizacionRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let UpdateOrganizacionUseCase = class UpdateOrganizacionUseCase {
    organizacionRepository;
    logActivityUseCase;
    constructor(organizacionRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.organizacionRepository = organizacionRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, valida con Zod y actualiza la organización; luego registra el cambio.
     * @param id - identificador de la organización.
     * @param data - payload crudo a validar.
     * @returns organización actualizada.
     */
    async execute(id, data) {
        const organizacion = await this.organizacionRepository.findById(id);
        if (!organizacion) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        const payload = OrganizacionDTOs_1.updateOrganizacionSchema.parse(data);
        const updated = await this.organizacionRepository.update(id, payload);
        await this.logActivityUseCase.execute({
            accion: 'organizacion.actualizada',
            mensaje: 'Se actualizó una organización',
            loggableType: 'organizacion',
            loggableId: id,
            payload
        });
        return updated;
    }
};
exports.UpdateOrganizacionUseCase = UpdateOrganizacionUseCase;
exports.UpdateOrganizacionUseCase = UpdateOrganizacionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [OrganizacionRepository_1.OrganizacionRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], UpdateOrganizacionUseCase);
