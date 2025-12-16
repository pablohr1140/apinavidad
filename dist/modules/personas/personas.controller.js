"use strict";
/**
 * # personas.controller
 * Propósito: Endpoints HTTP de personas.controller
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
exports.PersonasController = void 0;
/**
 * # PersonasController
 *
 * Propósito: gestiona endpoints de personas (listado, CRUD) con validación y permisos.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de personas, decoradores de permisos y usuario autenticado.
 */
const common_1 = require("@nestjs/common");
const PersonaDTOs_1 = require("../../application/dtos/PersonaDTOs");
const CreatePersonaUseCase_1 = require("../../application/use-cases/personas/CreatePersonaUseCase");
const DeletePersonaUseCase_1 = require("../../application/use-cases/personas/DeletePersonaUseCase");
const GetPersonaUseCase_1 = require("../../application/use-cases/personas/GetPersonaUseCase");
const ListPersonasUseCase_1 = require("../../application/use-cases/personas/ListPersonasUseCase");
const UpdatePersonaUseCase_1 = require("../../application/use-cases/personas/UpdatePersonaUseCase");
const auth_user_decorator_1 = require("../auth/decorators/auth-user.decorator");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const zod_validation_pipe_1 = require("../shared/pipes/zod-validation.pipe");
let PersonasController = class PersonasController {
    listPersonasUseCase;
    createPersonaUseCase;
    getPersonaUseCase;
    updatePersonaUseCase;
    deletePersonaUseCase;
    constructor(listPersonasUseCase, createPersonaUseCase, getPersonaUseCase, updatePersonaUseCase, deletePersonaUseCase) {
        this.listPersonasUseCase = listPersonasUseCase;
        this.createPersonaUseCase = createPersonaUseCase;
        this.getPersonaUseCase = getPersonaUseCase;
        this.updatePersonaUseCase = updatePersonaUseCase;
        this.deletePersonaUseCase = deletePersonaUseCase;
    }
    list(organizacionId, search) {
        const orgId = organizacionId ? Number(organizacionId) : undefined;
        return this.listPersonasUseCase.execute({
            organizacionId: Number.isNaN(orgId) ? undefined : orgId,
            search: search ?? undefined
        });
    }
    create(body) {
        return this.createPersonaUseCase.execute(body);
    }
    findOne(id) {
        return this.getPersonaUseCase.execute(id);
    }
    update(id, body) {
        return this.updatePersonaUseCase.execute(id, body);
    }
    async delete(id, user) {
        if (!user) {
            throw new common_1.ForbiddenException('Usuario no autenticado');
        }
        await this.deletePersonaUseCase.execute(id, user);
    }
};
exports.PersonasController = PersonasController;
__decorate([
    (0, permissions_decorator_1.Permissions)('personas.view'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('organizacionId')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonasController.prototype, "list", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('personas.create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(PersonaDTOs_1.createPersonaSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PersonasController.prototype, "create", null);
__decorate([
    (0, permissions_decorator_1.Permissions)('personas.view'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PersonasController.prototype, "findOne", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['personas.view', 'personas.update'] }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(PersonaDTOs_1.updatePersonaSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PersonasController.prototype, "update", null);
__decorate([
    (0, permissions_decorator_1.Permissions)({ mode: 'all', permissions: ['personas.view', 'personas.delete'] }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PersonasController.prototype, "delete", null);
exports.PersonasController = PersonasController = __decorate([
    (0, common_1.Controller)('personas'),
    __metadata("design:paramtypes", [ListPersonasUseCase_1.ListPersonasUseCase,
        CreatePersonaUseCase_1.CreatePersonaUseCase,
        GetPersonaUseCase_1.GetPersonaUseCase,
        UpdatePersonaUseCase_1.UpdatePersonaUseCase,
        DeletePersonaUseCase_1.DeletePersonaUseCase])
], PersonasController);
