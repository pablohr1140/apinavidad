"use strict";
/**
 * # organizaciones.controller
 * Propósito: Endpoints HTTP de organizaciones.controller
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
exports.OrganizacionesController = void 0;
/**
 * # OrganizacionesController
 *
 * Propósito: expone endpoints CRUD para organizaciones con validación y permisos.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de organizaciones, pipe Zod, decorator de permisos.
 */
const common_1 = require("@nestjs/common");
const OrganizacionDTOs_1 = require("../../application/dtos/OrganizacionDTOs");
const CreateOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/CreateOrganizacionUseCase");
const DeleteOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/DeleteOrganizacionUseCase");
const GetOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/GetOrganizacionUseCase");
const ListOrganizacionesUseCase_1 = require("../../application/use-cases/organizaciones/ListOrganizacionesUseCase");
const UpdateOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/UpdateOrganizacionUseCase");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const zod_validation_pipe_1 = require("../shared/pipes/zod-validation.pipe");
let OrganizacionesController = class OrganizacionesController {
    listOrganizacionesUseCase;
    createOrganizacionUseCase;
    getOrganizacionUseCase;
    updateOrganizacionUseCase;
    deleteOrganizacionUseCase;
    constructor(listOrganizacionesUseCase, createOrganizacionUseCase, getOrganizacionUseCase, updateOrganizacionUseCase, deleteOrganizacionUseCase) {
        this.listOrganizacionesUseCase = listOrganizacionesUseCase;
        this.createOrganizacionUseCase = createOrganizacionUseCase;
        this.getOrganizacionUseCase = getOrganizacionUseCase;
        this.updateOrganizacionUseCase = updateOrganizacionUseCase;
        this.deleteOrganizacionUseCase = deleteOrganizacionUseCase;
    }
    list(estado, tipo) {
        const cleanEstado = estado?.trim() || undefined;
        const cleanTipo = tipo?.trim() || undefined;
        try {
            return this.listOrganizacionesUseCase.execute({ estado: cleanEstado, tipo: cleanTipo });
        }
        catch (error) {
            console.error('OrganizacionesController.list error', { estado: cleanEstado, tipo: cleanTipo, error });
            throw error;
        }
    }
    create(body) {
        return this.createOrganizacionUseCase.execute(body);
    }
    getOne(id) {
        try {
            return this.getOrganizacionUseCase.execute(id);
        }
        catch (error) {
            console.error('OrganizacionesController.getOne error', { id, error });
            throw error;
        }
    }
    update(id, body) {
        return this.updateOrganizacionUseCase.execute(id, body);
    }
    async delete(id) {
        await this.deleteOrganizacionUseCase.execute(id);
    }
};
exports.OrganizacionesController = OrganizacionesController;
__decorate([
    (0, permissions_decorator_1.Permissions)('organizaciones.view'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('estado')),
    __param(1, (0, common_1.Query)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OrganizacionesController.prototype, "list", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('organizaciones.create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(OrganizacionDTOs_1.createOrganizacionSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizacionesController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('organizaciones.view'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizacionesController.prototype, "getOne", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['organizaciones.view', 'organizaciones.update'] }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(OrganizacionDTOs_1.updateOrganizacionSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrganizacionesController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['organizaciones.view', 'organizaciones.delete'] }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrganizacionesController.prototype, "delete", null);
exports.OrganizacionesController = OrganizacionesController = __decorate([
    (0, common_1.Controller)('organizaciones'),
    __metadata("design:paramtypes", [ListOrganizacionesUseCase_1.ListOrganizacionesUseCase,
        CreateOrganizacionUseCase_1.CreateOrganizacionUseCase,
        GetOrganizacionUseCase_1.GetOrganizacionUseCase,
        UpdateOrganizacionUseCase_1.UpdateOrganizacionUseCase,
        DeleteOrganizacionUseCase_1.DeleteOrganizacionUseCase])
], OrganizacionesController);
