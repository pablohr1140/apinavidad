"use strict";
/**
 * # Delete Organizacion Use Case
 * Propósito: Caso de uso Delete Organizacion Use Case
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
exports.DeleteOrganizacionUseCase = void 0;
/**
 * # DeleteOrganizacionUseCase
 *
 * Propósito: eliminar organizaciones tras validar existencia y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `OrganizacionRepository`, `LogActivityUseCase`, `AppError` para 404.
 */
const common_1 = require("@nestjs/common");
const OrganizacionRepository_1 = require("../../repositories/OrganizacionRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let DeleteOrganizacionUseCase = class DeleteOrganizacionUseCase {
    organizacionRepository;
    logActivityUseCase;
    constructor(organizacionRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.organizacionRepository = organizacionRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, elimina la organización y registra el evento.
     * @param id - identificador de la organización.
     */
    async execute(id) {
        const organizacion = await this.organizacionRepository.findById(id);
        if (!organizacion) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        await this.organizacionRepository.delete(id);
        await this.logActivityUseCase.execute({
            accion: 'organizacion.eliminada',
            mensaje: 'Se eliminó una organización',
            loggableType: 'organizacion',
            loggableId: id,
            payload: {
                nombre: organizacion.nombre,
                estado: organizacion.estado
            }
        });
    }
};
exports.DeleteOrganizacionUseCase = DeleteOrganizacionUseCase;
exports.DeleteOrganizacionUseCase = DeleteOrganizacionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [OrganizacionRepository_1.OrganizacionRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], DeleteOrganizacionUseCase);
