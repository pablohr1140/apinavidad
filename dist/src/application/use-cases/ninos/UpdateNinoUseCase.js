"use strict";
/**
 * # Update Nino Use Case
 * Propósito: Caso de uso Update Nino Use Case
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
exports.UpdateNinoUseCase = void 0;
/**
 * # UpdateNinoUseCase
 *
 * Propósito: actualizar niños validando existencia y edad máxima; registra auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `updateNinoSchema`, reglas de edad (`calcularEdad`, `MAX_EDAD`), `LogActivityUseCase`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const NinoDTOs_1 = require("../../dtos/NinoDTOs");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
const ninoRules_1 = require("../../../domain/services/ninoRules");
const AppError_1 = require("../../../shared/errors/AppError");
let UpdateNinoUseCase = class UpdateNinoUseCase {
    ninoRepository;
    periodoRepository;
    logActivityUseCase;
    constructor(ninoRepository, periodoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.periodoRepository = periodoRepository;
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
        const documentoNumero = payload.documento_numero ??
            (payload.run && payload.dv ? `${payload.run}-${payload.dv}` : payload.run ?? nino.documento_numero ?? null);
        const periodoId = payload.periodoId ?? nino.periodoId;
        const periodo = periodoId ? await this.periodoRepository.findById(periodoId) : null;
        if (periodoId && !periodo) {
            throw new AppError_1.AppError('Periodo no encontrado', 404);
        }
        const fechaReferencia = periodo?.fecha_inicio ?? new Date();
        const fechaNacimiento = payload.fecha_nacimiento ?? nino.fecha_nacimiento ?? undefined;
        const basePayload = {
            ...payload,
            documento_numero: payload.documento_numero ?? undefined
        };
        delete basePayload.run;
        delete basePayload.dv;
        if (documentoNumero) {
            basePayload.documento_numero = documentoNumero;
        }
        else {
            delete basePayload.documento_numero;
        }
        if (payload.estado === undefined)
            delete basePayload.estado;
        if (payload.fecha_retiro === undefined)
            delete basePayload.fecha_retiro;
        const updatePayload = { ...basePayload };
        if (fechaNacimiento) {
            const edad = (0, ninoRules_1.calcularEdad)(fechaNacimiento, fechaReferencia);
            if (edad !== null && edad >= ninoRules_1.MAX_EDAD) {
                updatePayload.estado = 'inhabilitado';
                updatePayload.fecha_retiro = fechaReferencia;
            }
        }
        const updated = await this.ninoRepository.update(id, updatePayload);
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
        PeriodoRepository_1.PeriodoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], UpdateNinoUseCase);
