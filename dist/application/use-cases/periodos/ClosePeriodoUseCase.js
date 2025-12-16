"use strict";
/**
 * # Close Periodo Use Case
 * Propósito: Caso de uso Close Periodo Use Case
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
exports.ClosePeriodoUseCase = void 0;
/**
 * # ClosePeriodoUseCase
 *
 * Propósito: cerrar un periodo existente y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `AppError`, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let ClosePeriodoUseCase = class ClosePeriodoUseCase {
    periodoRepository;
    logActivityUseCase;
    constructor(periodoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.periodoRepository = periodoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida existencia, cierra el periodo y registra la acción.
     * @param id - identificador del periodo.
     */
    async execute(id) {
        const periodo = await this.periodoRepository.findById(id);
        if (!periodo) {
            throw new AppError_1.AppError('Periodo no encontrado', 404);
        }
        const closed = await this.periodoRepository.close(id);
        await this.logActivityUseCase.execute({
            accion: 'periodo.cerrado',
            mensaje: 'Se cerró un periodo',
            loggableType: 'periodo',
            loggableId: id
        });
        return closed;
    }
};
exports.ClosePeriodoUseCase = ClosePeriodoUseCase;
exports.ClosePeriodoUseCase = ClosePeriodoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], ClosePeriodoUseCase);
