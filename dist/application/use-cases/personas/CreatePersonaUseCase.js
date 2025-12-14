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
exports.CreatePersonaUseCase = void 0;
/**
 * # CreatePersonaUseCase
 *
 * Propósito: crear personas, asignar roles y registrar actividad.
 * Pertenece a: Application layer.
 * Interacciones: `createPersonaSchema`, `PersonaRepository`, `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const PersonaRepository_1 = require("../../repositories/PersonaRepository");
const PersonaDTOs_1 = require("../../dtos/PersonaDTOs");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let CreatePersonaUseCase = class CreatePersonaUseCase {
    personaRepository;
    logActivityUseCase;
    constructor(personaRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.personaRepository = personaRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida el DTO, crea la persona con roles y registra auditoría.
     * @param data - entrada cruda a validar.
     * @returns persona creada.
     */
    execute(data) {
        const payload = PersonaDTOs_1.createPersonaSchema.parse(data);
        const { roles = [], ...persona } = payload;
        const now = new Date();
        return this.personaRepository
            .create({
            ...persona,
            createdAt: now,
            updatedAt: now,
            roleKeys: roles
        })
            .then((created) => {
            void this.logActivityUseCase.execute({
                accion: 'persona.creada',
                mensaje: 'Se creó una persona',
                loggableType: 'persona',
                loggableId: created.id,
                payload: {
                    nombres: created.nombres,
                    apellidos: created.apellidos,
                    email: created.email
                }
            });
            return created;
        });
    }
};
exports.CreatePersonaUseCase = CreatePersonaUseCase;
exports.CreatePersonaUseCase = CreatePersonaUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PersonaRepository_1.PersonaRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], CreatePersonaUseCase);
