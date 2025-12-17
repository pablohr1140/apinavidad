"use strict";
/**
 * # reportes.controller
 * Propósito: Endpoints HTTP de reportes.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportesController_1;
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
const ReporteDTOs_1 = require("../../application/dtos/ReporteDTOs");
const ListNinosUseCase_1 = require("../../application/use-cases/ninos/ListNinosUseCase");
const ninoRules_1 = require("../../domain/services/ninoRules");
const reporting_service_1 = require("../../infra/reporting/reporting.service");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let ReportesController = ReportesController_1 = class ReportesController {
    listNinosUseCase;
    reportingService;
    logger = new common_1.Logger(ReportesController_1.name);
    constructor(listNinosUseCase, reportingService) {
        this.listNinosUseCase = listNinosUseCase;
        this.reportingService = reportingService;
    }
    async listInhabilitados() {
        const ninos = await this.listNinosUseCase.execute({ estado: 'inhabilitado' });
        return { total: ninos.length, data: ninos };
    }
    async listado(query) {
        const data = await this.buildNinosData(query);
        return { total: data.length, data };
    }
    async listadoPdf(query, res) {
        const data = await this.buildNinosData(query);
        this.logger.log(`listadoPdf rows=${data.length}`);
        const pdf = await this.reportingService.buildPdf(data, 'Reporte de niños');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.pdf"');
        res.send(pdf);
    }
    async listadoExcel(query, res) {
        const data = await this.buildNinosData(query);
        const xlsx = await this.reportingService.buildExcel(data, 'Reporte de niños');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.xlsx"');
        res.send(xlsx);
    }
    async buildNinosData(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 100;
        const skip = (page - 1) * limit;
        const ninos = await this.listNinosUseCase.execute({
            periodoId: query.periodoId,
            organizacionId: query.organizacionId,
            estado: this.parseEstado(query.estado),
            skip,
            take: limit
        });
        this.logger.log(`buildNinosData rows=${ninos.length}`);
        return ninos.map((nino) => {
            const edadCalculada = (0, ninoRules_1.calcularEdad)(nino.fecha_nacimiento);
            const tiempoParaInhabilitar = edadCalculada != null ? Math.max(0, ninoRules_1.MAX_EDAD - edadCalculada) : null;
            return {
                ...nino,
                edad_calculada: edadCalculada,
                tiempo_para_inhabilitar: tiempoParaInhabilitar
            };
        });
    }
    parseEstado(value) {
        if (!value)
            return undefined;
        const normalized = value.trim().toLowerCase();
        const allowed = ['registrado', 'inhabilitado'];
        return allowed.includes(normalized) ? normalized : undefined;
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
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReporteDTOs_1.ListadoReportesQueryDto]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "listado", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)('ninos/listado.pdf'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReporteDTOs_1.ListadoReportesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "listadoPdf", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)('ninos/listado.xlsx'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReporteDTOs_1.ListadoReportesQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "listadoExcel", null);
exports.ReportesController = ReportesController = ReportesController_1 = __decorate([
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [ListNinosUseCase_1.ListNinosUseCase,
        reporting_service_1.ReportingService])
], ReportesController);
