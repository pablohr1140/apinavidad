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
exports.AutoInhabilitarNinosUseCase = void 0;
/**
 * # AutoInhabilitarNinosUseCase
 *
 * Propósito: inhabilitar en lote a los niños que superan la edad máxima, con opción dry-run y auditoría.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository` (autoInhabilitar), `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let AutoInhabilitarNinosUseCase = class AutoInhabilitarNinosUseCase {
    ninoRepository;
    logActivityUseCase;
    constructor(ninoRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.ninoRepository = ninoRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Ejecuta la auto-inhabilitación (o dry-run) y registra el resultado.
     * @param fechaReferencia - fecha a usar para calcular edad.
     * @param dryRun - si es true, solo reporta sin persistir cambios.
     */
    async execute({ fechaReferencia = new Date(), dryRun }) {
        const result = await this.ninoRepository.autoInhabilitar(fechaReferencia, dryRun);
        await this.logActivityUseCase.execute({
            accion: dryRun ? 'nino.autoinhabilitar.dryrun' : 'nino.autoinhabilitar',
            mensaje: 'Auto inhabilitación de niños',
            loggableType: 'nino.bulk',
            loggableId: 0,
            payload: {
                fechaReferencia,
                dryRun: !!dryRun,
                afectados: result.afectados
            }
        });
        return result;
    }
};
exports.AutoInhabilitarNinosUseCase = AutoInhabilitarNinosUseCase;
exports.AutoInhabilitarNinosUseCase = AutoInhabilitarNinosUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], AutoInhabilitarNinosUseCase);
