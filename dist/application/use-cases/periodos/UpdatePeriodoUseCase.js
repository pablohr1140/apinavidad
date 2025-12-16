"use strict";
/**
 * # Update Periodo Use Case
 * Propósito: Caso de uso Update Periodo Use Case
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
exports.UpdatePeriodoUseCase = void 0;
/**
 * # UpdatePeriodoUseCase
 *
 * Propósito: actualizar periodos tras validar existencia y DTO; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`, `updatePeriodoSchema`, `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const PeriodoDTOs_1 = require("../../dtos/PeriodoDTOs");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let UpdatePeriodoUseCase = class UpdatePeriodoUseCase {
    periodoRepository;
    logActivityUseCase;
    constructor(periodoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.periodoRepository = periodoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, valida DTO y actualiza; registra la actividad.
     * @param id - identificador del periodo.
     * @param data - payload crudo a validar.
     */
    async execute(id, data) {
        const periodo = await this.periodoRepository.findById(id);
        if (!periodo) {
            throw new AppError_1.AppError('Periodo no encontrado', 404);
        }
        const payload = PeriodoDTOs_1.updatePeriodoSchema.parse(data);
        const normalized = normalizeEstadoActivo(payload.estado_periodo ?? periodo.estado_periodo, payload.es_activo ?? periodo.es_activo);
        const mergedPayload = {
            ...payload,
            estado_periodo: normalized.estado_periodo,
            es_activo: normalized.es_activo
        };
        const overlap = await this.periodoRepository.findOverlapping({
            start: mergedPayload.fecha_inicio ?? periodo.fecha_inicio ?? null,
            end: mergedPayload.fecha_fin ?? periodo.fecha_fin ?? null,
            excludeId: id
        });
        if (overlap) {
            throw new AppError_1.AppError('Ya existe un periodo que se sobrepone en fechas', 409);
        }
        const updated = await this.periodoRepository.update(id, mergedPayload);
        await this.logActivityUseCase.execute({
            accion: 'periodo.actualizado',
            mensaje: 'Se actualizó un periodo',
            loggableType: 'periodo',
            loggableId: id,
            payload
        });
        return updated;
    }
};
exports.UpdatePeriodoUseCase = UpdatePeriodoUseCase;
exports.UpdatePeriodoUseCase = UpdatePeriodoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], UpdatePeriodoUseCase);
function normalizeEstadoActivo(estado, activo) {
    let nextEstado = estado;
    let nextActivo = activo;
    if (nextEstado === 'abierto') {
        nextActivo = true;
    }
    else if (nextActivo) {
        nextEstado = 'abierto';
        nextActivo = true;
    }
    else {
        nextActivo = false;
    }
    return { estado_periodo: nextEstado, es_activo: nextActivo };
}
