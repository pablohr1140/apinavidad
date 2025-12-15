"use strict";
/**
 * # Create Periodo Use Case
 * Propósito: Caso de uso Create Periodo Use Case
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
exports.CreatePeriodoUseCase = void 0;
/**
 * # CreatePeriodoUseCase
 *
 * Propósito: crear periodos validando DTO y registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `createPeriodoSchema`, `PeriodoRepository`, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const PeriodoDTOs_1 = require("../../dtos/PeriodoDTOs");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let CreatePeriodoUseCase = class CreatePeriodoUseCase {
    periodoRepository;
    logActivityUseCase;
    constructor(periodoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.periodoRepository = periodoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida el DTO, crea el periodo y registra actividad.
     * @param data - payload crudo a validar.
     */
    execute(data) {
        const payload = PeriodoDTOs_1.createPeriodoSchema.parse(data);
        return this.periodoRepository.create(payload).then((created) => {
            void this.logActivityUseCase.execute({
                accion: 'periodo.creado',
                mensaje: 'Se creó un periodo',
                loggableType: 'periodo',
                loggableId: created.id,
                payload: {
                    nombre: created.nombre,
                    estado_periodo: created.estado_periodo
                }
            });
            return created;
        });
    }
};
exports.CreatePeriodoUseCase = CreatePeriodoUseCase;
exports.CreatePeriodoUseCase = CreatePeriodoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], CreatePeriodoUseCase);
