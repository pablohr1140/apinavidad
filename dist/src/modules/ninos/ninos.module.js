"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NinosModule = void 0;
const common_1 = require("@nestjs/common");
const ninos_controller_1 = require("./ninos.controller");
const ListNinosUseCase_1 = require("../../application/use-cases/ninos/ListNinosUseCase");
const CreateNinoUseCase_1 = require("../../application/use-cases/ninos/CreateNinoUseCase");
const GetNinoUseCase_1 = require("../../application/use-cases/ninos/GetNinoUseCase");
const UpdateNinoUseCase_1 = require("../../application/use-cases/ninos/UpdateNinoUseCase");
const InhabilitarNinoUseCase_1 = require("../../application/use-cases/ninos/InhabilitarNinoUseCase");
const RestaurarNinoUseCase_1 = require("../../application/use-cases/ninos/RestaurarNinoUseCase");
const AutoInhabilitarNinosUseCase_1 = require("../../application/use-cases/ninos/AutoInhabilitarNinosUseCase");
const NinoRepository_1 = require("../../application/repositories/NinoRepository");
const PrismaNinoRepository_1 = require("../../infra/database/repositories/PrismaNinoRepository");
const logs_module_1 = require("../logs/logs.module");
let NinosModule = class NinosModule {
};
exports.NinosModule = NinosModule;
exports.NinosModule = NinosModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [ninos_controller_1.NinosController],
        providers: [
            ListNinosUseCase_1.ListNinosUseCase,
            CreateNinoUseCase_1.CreateNinoUseCase,
            GetNinoUseCase_1.GetNinoUseCase,
            UpdateNinoUseCase_1.UpdateNinoUseCase,
            InhabilitarNinoUseCase_1.InhabilitarNinoUseCase,
            RestaurarNinoUseCase_1.RestaurarNinoUseCase,
            AutoInhabilitarNinosUseCase_1.AutoInhabilitarNinosUseCase,
            PrismaNinoRepository_1.PrismaNinoRepository,
            { provide: NinoRepository_1.NinoRepository, useExisting: PrismaNinoRepository_1.PrismaNinoRepository }
        ],
        exports: [ListNinosUseCase_1.ListNinosUseCase, AutoInhabilitarNinosUseCase_1.AutoInhabilitarNinosUseCase]
    })
], NinosModule);
