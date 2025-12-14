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
exports.OpenPeriodoUseCase = void 0;
/**
 * # OpenPeriodoUseCase
 *
 * Propósito: abrir un periodo existente y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `AppError`, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const AppError_1 = require("../../../shared/errors/AppError");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let OpenPeriodoUseCase = class OpenPeriodoUseCase {
    periodoRepository;
    logActivityUseCase;
    constructor(periodoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.periodoRepository = periodoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, abre el periodo y registra la acción.
     * @param id - identificador de periodo.
     */
    async execute(id) {
        const periodo = await this.periodoRepository.findById(id);
        if (!periodo) {
            throw new AppError_1.AppError('Periodo no encontrado', 404);
        }
        const opened = await this.periodoRepository.open(id);
        await this.logActivityUseCase.execute({
            accion: 'periodo.abierto',
            mensaje: 'Se abrió un periodo',
            loggableType: 'periodo',
            loggableId: id
        });
        return opened;
    }
};
exports.OpenPeriodoUseCase = OpenPeriodoUseCase;
exports.OpenPeriodoUseCase = OpenPeriodoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], OpenPeriodoUseCase);
