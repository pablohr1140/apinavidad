"use strict";
/**
 * # Restaurar Nino Use Case
 * Propósito: Caso de uso Restaurar Nino Use Case
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
exports.RestaurarNinoUseCase = void 0;
/**
 * # RestaurarNinoUseCase
 *
 * Propósito: restaurar un niño inhabilitado y registrar auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError` para 404, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let RestaurarNinoUseCase = class RestaurarNinoUseCase {
    ninoRepository;
    logActivityUseCase;
    constructor(ninoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, restaura el estado y registra el evento.
     * @param id - identificador del niño.
     * @param personaId - actor opcional para la auditoría.
     */
    async execute(id, personaId) {
        const nino = await this.ninoRepository.findById(id);
        if (!nino) {
            throw new AppError_1.AppError('Niño no encontrado', 404);
        }
        const restored = await this.ninoRepository.restaurar(id);
        await this.logActivityUseCase.execute({
            personaId,
            accion: 'nino.restaurado',
            mensaje: '',
            loggableType: 'nino',
            loggableId: id,
            payload: { nino }
        });
        return restored;
    }
};
exports.RestaurarNinoUseCase = RestaurarNinoUseCase;
exports.RestaurarNinoUseCase = RestaurarNinoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], RestaurarNinoUseCase);
