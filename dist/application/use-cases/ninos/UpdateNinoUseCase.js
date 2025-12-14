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
exports.UpdateNinoUseCase = void 0;
/**
 * # UpdateNinoUseCase
 *
 * Propósito: actualizar niños validando existencia y edad máxima; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `updateNinoSchema`, reglas de edad (`calcularEdad`, `MAX_EDAD`), `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const NinoDTOs_1 = require("../../dtos/NinoDTOs");
const AppError_1 = require("../../../shared/errors/AppError");
const ninoRules_1 = require("../../../domain/services/ninoRules");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let UpdateNinoUseCase = class UpdateNinoUseCase {
    ninoRepository;
    logActivityUseCase;
    constructor(ninoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, valida payload, comprueba edad y actualiza; registra auditoría.
     * @param id - identificador del niño.
     * @param data - payload crudo a validar.
     */
    async execute(id, data) {
        const nino = await this.ninoRepository.findById(id);
        if (!nino) {
            throw new AppError_1.AppError('Niño no encontrado', 404);
        }
        const payload = NinoDTOs_1.updateNinoSchema.parse(data);
        if (payload.fecha_nacimiento) {
            const edad = (0, ninoRules_1.calcularEdad)(payload.fecha_nacimiento);
            if (edad !== null && edad > ninoRules_1.MAX_EDAD) {
                throw new AppError_1.AppError('El niño supera la edad máxima permitida', 400);
            }
        }
        const updated = await this.ninoRepository.update(id, payload);
        await this.logActivityUseCase.execute({
            personaId: payload.datosDomicilio?.personaId,
            accion: 'nino.actualizado',
            mensaje: '',
            loggableType: 'nino',
            loggableId: id,
            payload
        });
        return updated;
    }
};
exports.UpdateNinoUseCase = UpdateNinoUseCase;
exports.UpdateNinoUseCase = UpdateNinoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], UpdateNinoUseCase);
