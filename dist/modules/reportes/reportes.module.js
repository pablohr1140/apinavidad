"use strict";
/**
 * # reportes.module
 * Propósito: Módulo de agregación reportes.module
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
exports.ReportesModule = void 0;
const common_1 = require("@nestjs/common");
const reportes_controller_1 = require("./reportes.controller");
const reporting_service_1 = require("../../infra/reporting/reporting.service");
const ninos_module_1 = require("../ninos/ninos.module");
let ReportesModule = class ReportesModule {
};
exports.ReportesModule = ReportesModule;
exports.ReportesModule = ReportesModule = __decorate([
    (0, common_1.Module)({
        imports: [ninos_module_1.NinosModule],
        controllers: [reportes_controller_1.ReportesController],
        providers: [reporting_service_1.ReportingService]
    })
], ReportesModule);
