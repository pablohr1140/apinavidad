"use strict";
/**
 * # periodos.controller
 * Propósito: Endpoints HTTP de periodos.controller
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodosController = void 0;
/**
 * # PeriodosController
 *
 * Propósito: administra endpoints de periodos (listado, creación, actualización y cambios de estado).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de periodos, validación Zod y permisos.
 */
const common_1 = require("@nestjs/common");
const PeriodoDTOs_1 = require("../../application/dtos/PeriodoDTOs");
const ActivatePeriodoUseCase_1 = require("../../application/use-cases/periodos/ActivatePeriodoUseCase");
const ClosePeriodoUseCase_1 = require("../../application/use-cases/periodos/ClosePeriodoUseCase");
const CreatePeriodoUseCase_1 = require("../../application/use-cases/periodos/CreatePeriodoUseCase");
const GetPeriodoUseCase_1 = require("../../application/use-cases/periodos/GetPeriodoUseCase");
const ListPeriodosUseCase_1 = require("../../application/use-cases/periodos/ListPeriodosUseCase");
const OpenPeriodoUseCase_1 = require("../../application/use-cases/periodos/OpenPeriodoUseCase");
const UpdatePeriodoUseCase_1 = require("../../application/use-cases/periodos/UpdatePeriodoUseCase");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const zod_validation_pipe_1 = require("../shared/pipes/zod-validation.pipe");
let PeriodosController = class PeriodosController {
    listPeriodosUseCase;
    createPeriodoUseCase;
    updatePeriodoUseCase;
    openPeriodoUseCase;
    closePeriodoUseCase;
    activatePeriodoUseCase;
    getPeriodoUseCase;
    constructor(listPeriodosUseCase, createPeriodoUseCase, updatePeriodoUseCase, openPeriodoUseCase, closePeriodoUseCase, activatePeriodoUseCase, getPeriodoUseCase) {
        this.listPeriodosUseCase = listPeriodosUseCase;
        this.createPeriodoUseCase = createPeriodoUseCase;
        this.updatePeriodoUseCase = updatePeriodoUseCase;
        this.openPeriodoUseCase = openPeriodoUseCase;
        this.closePeriodoUseCase = closePeriodoUseCase;
        this.activatePeriodoUseCase = activatePeriodoUseCase;
        this.getPeriodoUseCase = getPeriodoUseCase;
    }
    get(id) {
        return this.getPeriodoUseCase.execute(id);
    }
    list(estado, activo) {
        return this.listPeriodosUseCase.execute({
            estado: estado ?? undefined,
            activo
        });
    }
    create(body) {
        return this.createPeriodoUseCase.execute(body);
    }
    update(id, body) {
        return this.updatePeriodoUseCase.execute(id, body);
    }
    open(id) {
        return this.openPeriodoUseCase.execute(id);
    }
    close(id) {
        return this.closePeriodoUseCase.execute(id);
    }
    activate(id) {
        return this.activatePeriodoUseCase.execute(id);
    }
};
exports.PeriodosController = PeriodosController;
__decorate([
    (0, permissions_decorator_1.Permissions)('periodos.view'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "get", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('periodos.view'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('activo', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "list", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('periodos.create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(PeriodoDTOs_1.createPeriodoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(PeriodoDTOs_1.updatePeriodoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] }),
    (0, common_1.Post)(':id/open'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "open", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] }),
    (0, common_1.Post)(':id/close'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "close", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] }),
    (0, common_1.Post)(':id/activate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PeriodosController.prototype, "activate", null);
exports.PeriodosController = PeriodosController = __decorate([
    (0, common_1.Controller)('periodos'),
    __metadata("design:paramtypes", [ListPeriodosUseCase_1.ListPeriodosUseCase,
        CreatePeriodoUseCase_1.CreatePeriodoUseCase,
        UpdatePeriodoUseCase_1.UpdatePeriodoUseCase,
        OpenPeriodoUseCase_1.OpenPeriodoUseCase,
        ClosePeriodoUseCase_1.ClosePeriodoUseCase,
        ActivatePeriodoUseCase_1.ActivatePeriodoUseCase,
        GetPeriodoUseCase_1.GetPeriodoUseCase])
], PeriodosController);
