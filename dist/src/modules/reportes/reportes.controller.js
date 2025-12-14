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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesController = void 0;
/**
 * # ReportesController
 *
 * Propósito: expone reportes derivados de niños (inhabilitados, listados con cálculos).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: `ListNinosUseCase`, reglas de negocio de edad/inhabilitación.
 */
const common_1 = require("@nestjs/common");
const ListNinosUseCase_1 = require("../../application/use-cases/ninos/ListNinosUseCase");
const ninoRules_1 = require("../../domain/services/ninoRules");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ReportesController = class ReportesController {
    listNinosUseCase;
    constructor(listNinosUseCase) {
        this.listNinosUseCase = listNinosUseCase;
    }
    async listInhabilitados() {
        const ninos = await this.listNinosUseCase.execute({ estado: 'inhabilitado' });
        return { total: ninos.length, data: ninos };
    }
    async listado(periodoId, organizacionId, estado) {
        const ninos = await this.listNinosUseCase.execute({
            periodoId: this.toNumber(periodoId),
            organizacionId: this.toNumber(organizacionId),
            estado: estado ?? undefined
        });
        const data = ninos.map((nino) => {
            const edadCalculada = (0, ninoRules_1.calcularEdad)(nino.fecha_nacimiento);
            const tiempoParaInhabilitar = edadCalculada != null ? Math.max(0, ninoRules_1.MAX_EDAD - edadCalculada) : null;
            return {
                ...nino,
                edad_calculada: edadCalculada,
                tiempo_para_inhabilitar: tiempoParaInhabilitar
            };
        });
        return { total: data.length, data };
    }
    toNumber(value) {
        if (!value)
            return undefined;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)('ninos/inhabilitados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "listInhabilitados", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)('ninos/listado'),
    __param(0, (0, common_1.Query)('periodoId')),
    __param(1, (0, common_1.Query)('organizacionId')),
    __param(2, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "listado", null);
exports.ReportesController = ReportesController = __decorate([
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [ListNinosUseCase_1.ListNinosUseCase])
], ReportesController);
