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
exports.CreateNinoUseCase = void 0;
/**
 * # CreateNinoUseCase
 *
 * Propósito: crear niños validando edad y registrando actividad.
 * Pertenece a: Application layer.
 * Interacciones: `createNinoSchema`, `NinoRepository`, reglas de dominio (`calcularEdad`, `MAX_EDAD`), `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const NinoDTOs_1 = require("../../dtos/NinoDTOs");
const AppError_1 = require("../../../shared/errors/AppError");
const ninoRules_1 = require("../../../domain/services/ninoRules");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let CreateNinoUseCase = class CreateNinoUseCase {
    ninoRepository;
    logActivityUseCase;
    constructor(ninoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida el DTO, comprueba edad máxima y crea el niño; luego registra auditoría.
     * @param data - payload crudo a validar.
     */
    async execute(data) {
        const payload = NinoDTOs_1.createNinoSchema.parse(data);
        if (payload.fecha_nacimiento) {
            const edad = (0, ninoRules_1.calcularEdad)(payload.fecha_nacimiento);
            if (edad !== null && edad > ninoRules_1.MAX_EDAD) {
                throw new AppError_1.AppError('El niño supera la edad máxima permitida', 400);
            }
        }
        const created = await this.ninoRepository.create(payload);
        await this.logActivityUseCase.execute({
            accion: 'nino.creado',
            mensaje: 'Se creó un niño',
            loggableType: 'nino',
            loggableId: created.id,
            payload: {
                nombres: created.nombres,
                apellidos: created.apellidos,
                organizacionId: created.organizacionId,
                periodoId: created.periodoId
            }
        });
        return created;
    }
};
exports.CreateNinoUseCase = CreateNinoUseCase;
exports.CreateNinoUseCase = CreateNinoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], CreateNinoUseCase);
