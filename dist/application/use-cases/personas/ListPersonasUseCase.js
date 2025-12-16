"use strict";
/**
 * # List Personas Use Case
 * Propósito: Caso de uso List Personas Use Case
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
exports.ListPersonasUseCase = void 0;
/**
 * # ListPersonasUseCase
 *
 * Propósito: listar personas con filtros opcionales (organización, búsqueda).
 * Pertenece a: Application layer.
 * Interacciones: depende de `PersonaRepository` (Prisma).
 */
const common_1 = require("@nestjs/common");
const PersonaRepository_1 = require("../../repositories/PersonaRepository");
let ListPersonasUseCase = class ListPersonasUseCase {
    personaRepository;
    constructor(personaRepository) {
        this.personaRepository = personaRepository;
    }
    /**
     * Delegación de filtros al repositorio para obtener personas.
     * @param params - filtros permitidos por el repositorio.
     */
    execute(params) {
        return this.personaRepository.findMany(params);
    }
};
exports.ListPersonasUseCase = ListPersonasUseCase;
exports.ListPersonasUseCase = ListPersonasUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PersonaRepository_1.PersonaRepository])
], ListPersonasUseCase);
