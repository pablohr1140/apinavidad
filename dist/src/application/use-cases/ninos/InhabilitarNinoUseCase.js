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
exports.InhabilitarNinoUseCase = void 0;
/**
 * # InhabilitarNinoUseCase
 *
 * Propósito: inhabilitar un niño con motivo/fecha, registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError` para 404, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const AppError_1 = require("../../../shared/errors/AppError");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let InhabilitarNinoUseCase = class InhabilitarNinoUseCase {
    ninoRepository;
    logActivityUseCase;
    constructor(ninoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, delega inhabilitación con motivo/fecha y registra auditoría.
     * @param id - identificador del niño.
     * @param payload - datos de inhabilitación (fecha, motivo, personaId opcional).
     */
    async execute(id, payload) {
        const nino = await this.ninoRepository.findById(id);
        if (!nino) {
            throw new AppError_1.AppError('Niño no encontrado', 404);
        }
        const updated = await this.ninoRepository.inhabilitar(id, payload);
        await this.logActivityUseCase.execute({
            personaId: payload.personaId,
            accion: 'nino.inhabilitado',
            mensaje: payload.motivo,
            loggableType: 'nino',
            loggableId: id,
            payload: { ...payload }
        });
        return updated;
    }
};
exports.InhabilitarNinoUseCase = InhabilitarNinoUseCase;
exports.InhabilitarNinoUseCase = InhabilitarNinoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], InhabilitarNinoUseCase);
