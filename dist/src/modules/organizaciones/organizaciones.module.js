"use strict";
/**
 * # organizaciones.module
 * Propósito: Módulo de agregación organizaciones.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizacionesModule = void 0;
const common_1 = require("@nestjs/common");
const organizaciones_controller_1 = require("./organizaciones.controller");
const OrganizacionRepository_1 = require("../../application/repositories/OrganizacionRepository");
const CreateOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/CreateOrganizacionUseCase");
const DeleteOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/DeleteOrganizacionUseCase");
const GetOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/GetOrganizacionUseCase");
const ListOrganizacionesUseCase_1 = require("../../application/use-cases/organizaciones/ListOrganizacionesUseCase");
const UpdateOrganizacionUseCase_1 = require("../../application/use-cases/organizaciones/UpdateOrganizacionUseCase");
const PrismaOrganizacionRepository_1 = require("../../infra/database/repositories/PrismaOrganizacionRepository");
const logs_module_1 = require("../logs/logs.module");
let OrganizacionesModule = class OrganizacionesModule {
};
exports.OrganizacionesModule = OrganizacionesModule;
exports.OrganizacionesModule = OrganizacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [organizaciones_controller_1.OrganizacionesController],
        providers: [
            ListOrganizacionesUseCase_1.ListOrganizacionesUseCase,
            CreateOrganizacionUseCase_1.CreateOrganizacionUseCase,
            GetOrganizacionUseCase_1.GetOrganizacionUseCase,
            UpdateOrganizacionUseCase_1.UpdateOrganizacionUseCase,
            DeleteOrganizacionUseCase_1.DeleteOrganizacionUseCase,
            PrismaOrganizacionRepository_1.PrismaOrganizacionRepository,
            { provide: OrganizacionRepository_1.OrganizacionRepository, useExisting: PrismaOrganizacionRepository_1.PrismaOrganizacionRepository }
        ],
        exports: [OrganizacionRepository_1.OrganizacionRepository]
    })
], OrganizacionesModule);
