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
exports.UpdatePersonaUseCase = void 0;
/**
 * # UpdatePersonaUseCase
 *
 * Propósito: actualizar personas y sus roles tras validar entrada y existencia; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository`, `updatePersonaSchema`, `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const PersonaRepository_1 = require("../../repositories/PersonaRepository");
const PersonaDTOs_1 = require("../../dtos/PersonaDTOs");
const AppError_1 = require("../../../shared/errors/AppError");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let UpdatePersonaUseCase = class UpdatePersonaUseCase {
    personaRepository;
    logActivityUseCase;
    constructor(personaRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.personaRepository = personaRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Verifica existencia, valida DTO, actualiza y registra el cambio.
     * @param id - persona objetivo.
     * @param data - payload crudo a validar.
     */
    async execute(id, data) {
        const persona = await this.personaRepository.findById(id);
        if (!persona) {
            throw new AppError_1.AppError('Persona no encontrada', 404);
        }
        const payload = PersonaDTOs_1.updatePersonaSchema.parse(data);
        const { roles, ...rest } = payload;
        const updated = await this.personaRepository.update(id, { ...rest, roleKeys: roles });
        await this.logActivityUseCase.execute({
            accion: 'persona.actualizada',
            mensaje: 'Se actualizó una persona',
            loggableType: 'persona',
            loggableId: id,
            payload: {
                cambios: rest,
                roles
            }
        });
        return updated;
    }
};
exports.UpdatePersonaUseCase = UpdatePersonaUseCase;
exports.UpdatePersonaUseCase = UpdatePersonaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PersonaRepository_1.PersonaRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], UpdatePersonaUseCase);
