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
exports.GetPersonaUseCase = void 0;
/**
 * # GetPersonaUseCase
 *
 * Propósito: obtener una persona por id con manejo de 404.
 * Pertenece a: Application layer.
 * Interacciones: `PersonaRepository` y `AppError` para not found.
 */
const common_1 = require("@nestjs/common");
const PersonaRepository_1 = require("../../repositories/PersonaRepository");
const AppError_1 = require("../../../shared/errors/AppError");
let GetPersonaUseCase = class GetPersonaUseCase {
    personaRepository;
    constructor(personaRepository) {
        this.personaRepository = personaRepository;
    }
    /**
     * Busca una persona por id; lanza 404 si no existe.
     * @param id - identificador de persona.
     */
    async execute(id) {
        const persona = await this.personaRepository.findById(id);
        if (!persona) {
            throw new AppError_1.AppError('Persona no encontrada', 404);
        }
        return persona;
    }
};
exports.GetPersonaUseCase = GetPersonaUseCase;
exports.GetPersonaUseCase = GetPersonaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PersonaRepository_1.PersonaRepository])
], GetPersonaUseCase);
