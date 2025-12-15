"use strict";
/**
 * # Delete Persona Use Case
 * Propósito: Caso de uso Delete Persona Use Case
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
exports.DeletePersonaUseCase = void 0;
/**
 * # DeletePersonaUseCase
 *
 * Propósito: eliminar personas aplicando validación de jerarquía de roles y registrando auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository`, `AuthenticatedUser`, `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const PersonaRepository_1 = require("../../repositories/PersonaRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let DeletePersonaUseCase = class DeletePersonaUseCase {
    personaRepository;
    logActivityUseCase;
    constructor(personaRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.personaRepository = personaRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida existencia y jerarquía de roles antes de eliminar; registra auditoría con el actor.
     * @param id - persona a eliminar.
     * @param actor - usuario autenticado que ejecuta la acción.
     */
    async execute(id, actor) {
        const persona = await this.personaRepository.findById(id);
        if (!persona) {
            throw new AppError_1.AppError('Persona no encontrada', 404);
        }
        const actorRank = this.getHighestRank(actor.roles);
        const targetRank = this.getHighestRank(persona.roles);
        if (actorRank <= targetRank) {
            throw new AppError_1.AppError('No tienes permisos para eliminar esta persona', 403);
        }
        await this.personaRepository.delete(id);
        await this.logActivityUseCase.execute({
            personaId: actor.id,
            accion: 'persona.eliminada',
            mensaje: 'Se eliminó una persona',
            loggableType: 'persona',
            loggableId: id,
            payload: {
                actorId: actor.id,
                actorRoles: actor.roles.map((role) => role.key)
            }
        });
    }
    getHighestRank(roles) {
        if (!roles.length) {
            return 0;
        }
        return Math.max(...roles.map((role) => role.rank));
    }
};
exports.DeletePersonaUseCase = DeletePersonaUseCase;
exports.DeletePersonaUseCase = DeletePersonaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PersonaRepository_1.PersonaRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], DeletePersonaUseCase);
