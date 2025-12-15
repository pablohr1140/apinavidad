"use strict";
/**
 * # ninos.controller
 * Propósito: Endpoints HTTP de ninos.controller
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
exports.NinosController = void 0;
/**
 * # NinosController
 *
 * Propósito: expone CRUD y acciones de niños (inhabilitar/restaurar/auto-inhabilitar).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de niños, validación Zod y permisos.
 */
const common_1 = require("@nestjs/common");
const NinoDTOs_1 = require("../../application/dtos/NinoDTOs");
const AutoInhabilitarNinosUseCase_1 = require("../../application/use-cases/ninos/AutoInhabilitarNinosUseCase");
const CreateNinoUseCase_1 = require("../../application/use-cases/ninos/CreateNinoUseCase");
const GetNinoUseCase_1 = require("../../application/use-cases/ninos/GetNinoUseCase");
const InhabilitarNinoUseCase_1 = require("../../application/use-cases/ninos/InhabilitarNinoUseCase");
const ListNinosUseCase_1 = require("../../application/use-cases/ninos/ListNinosUseCase");
const RestaurarNinoUseCase_1 = require("../../application/use-cases/ninos/RestaurarNinoUseCase");
const UpdateNinoUseCase_1 = require("../../application/use-cases/ninos/UpdateNinoUseCase");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const zod_validation_pipe_1 = require("../shared/pipes/zod-validation.pipe");
let NinosController = class NinosController {
    listNinosUseCase;
    createNinoUseCase;
    getNinoUseCase;
    updateNinoUseCase;
    inhabilitarNinoUseCase;
    restaurarNinoUseCase;
    autoInhabilitarNinosUseCase;
    constructor(listNinosUseCase, createNinoUseCase, getNinoUseCase, updateNinoUseCase, inhabilitarNinoUseCase, restaurarNinoUseCase, autoInhabilitarNinosUseCase) {
        this.listNinosUseCase = listNinosUseCase;
        this.createNinoUseCase = createNinoUseCase;
        this.getNinoUseCase = getNinoUseCase;
        this.updateNinoUseCase = updateNinoUseCase;
        this.inhabilitarNinoUseCase = inhabilitarNinoUseCase;
        this.restaurarNinoUseCase = restaurarNinoUseCase;
        this.autoInhabilitarNinosUseCase = autoInhabilitarNinosUseCase;
    }
    list(periodoId, organizacionId, estado) {
        return this.listNinosUseCase.execute({
            periodoId: this.parseNumber(periodoId),
            organizacionId: this.parseNumber(organizacionId),
            estado: this.parseEstado(estado)
        });
    }
    create(body) {
        return this.createNinoUseCase.execute(body);
    }
    findOne(id) {
        return this.getNinoUseCase.execute(id);
    }
    update(id, body) {
        return this.updateNinoUseCase.execute(id, body);
    }
    inhabilitar(id, body) {
        return this.inhabilitarNinoUseCase.execute(id, body);
    }
    restaurar(id) {
        return this.restaurarNinoUseCase.execute(id);
    }
    autoInhabilitar(body) {
        return this.autoInhabilitarNinosUseCase.execute(body);
    }
    parseNumber(value) {
        if (!value)
            return undefined;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    parseBoolean(value) {
        if (value === undefined)
            return undefined;
        if (value === '1' || value?.toLowerCase() === 'true')
            return true;
        if (value === '0' || value?.toLowerCase() === 'false')
            return false;
        return undefined;
    }
    parseEstado(value) {
        if (!value)
            return undefined;
        const normalized = value.trim().toLowerCase();
        const allowed = ['registrado', 'validado', 'egresado', 'inhabilitado'];
        return allowed.includes(normalized) ? normalized : undefined;
    }
};
exports.NinosController = NinosController;
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('periodoId')),
    __param(1, (0, common_1.Query)('organizacionId')),
    __param(2, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "list", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(NinoDTOs_1.createNinoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('ninos.view'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "findOne", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(NinoDTOs_1.updateNinoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] }),
    (0, common_1.Post)(':id/inhabilitar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(NinoDTOs_1.inhabilitarNinoSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "inhabilitar", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] }),
    (0, common_1.Post)(':id/restaurar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "restaurar", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] }),
    (0, common_1.Post)('auto-inhabilitar'),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(NinoDTOs_1.autoInhabilitarSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NinosController.prototype, "autoInhabilitar", null);
exports.NinosController = NinosController = __decorate([
    (0, common_1.Controller)('ninos'),
    __metadata("design:paramtypes", [ListNinosUseCase_1.ListNinosUseCase,
        CreateNinoUseCase_1.CreateNinoUseCase,
        GetNinoUseCase_1.GetNinoUseCase,
        UpdateNinoUseCase_1.UpdateNinoUseCase,
        InhabilitarNinoUseCase_1.InhabilitarNinoUseCase,
        RestaurarNinoUseCase_1.RestaurarNinoUseCase,
        AutoInhabilitarNinosUseCase_1.AutoInhabilitarNinosUseCase])
], NinosController);
