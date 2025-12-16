"use strict";
/**
 * # periodos.module
 * Propósito: Módulo de agregación periodos.module
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
exports.PeriodosModule = void 0;
const common_1 = require("@nestjs/common");
const periodos_controller_1 = require("./periodos.controller");
const PeriodoRepository_1 = require("../../application/repositories/PeriodoRepository");
const ActivatePeriodoUseCase_1 = require("../../application/use-cases/periodos/ActivatePeriodoUseCase");
const ClosePeriodoUseCase_1 = require("../../application/use-cases/periodos/ClosePeriodoUseCase");
const CreatePeriodoUseCase_1 = require("../../application/use-cases/periodos/CreatePeriodoUseCase");
const GetPeriodoUseCase_1 = require("../../application/use-cases/periodos/GetPeriodoUseCase");
const ListPeriodosUseCase_1 = require("../../application/use-cases/periodos/ListPeriodosUseCase");
const OpenPeriodoUseCase_1 = require("../../application/use-cases/periodos/OpenPeriodoUseCase");
const UpdatePeriodoUseCase_1 = require("../../application/use-cases/periodos/UpdatePeriodoUseCase");
const PrismaPeriodoRepository_1 = require("../../infra/database/repositories/PrismaPeriodoRepository");
const logs_module_1 = require("../logs/logs.module");
let PeriodosModule = class PeriodosModule {
};
exports.PeriodosModule = PeriodosModule;
exports.PeriodosModule = PeriodosModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [periodos_controller_1.PeriodosController],
        providers: [
            ListPeriodosUseCase_1.ListPeriodosUseCase,
            CreatePeriodoUseCase_1.CreatePeriodoUseCase,
            UpdatePeriodoUseCase_1.UpdatePeriodoUseCase,
            OpenPeriodoUseCase_1.OpenPeriodoUseCase,
            ClosePeriodoUseCase_1.ClosePeriodoUseCase,
            ActivatePeriodoUseCase_1.ActivatePeriodoUseCase,
            GetPeriodoUseCase_1.GetPeriodoUseCase,
            PrismaPeriodoRepository_1.PrismaPeriodoRepository,
            { provide: PeriodoRepository_1.PeriodoRepository, useExisting: PrismaPeriodoRepository_1.PrismaPeriodoRepository }
        ],
        exports: [PeriodoRepository_1.PeriodoRepository]
    })
], PeriodosModule);
