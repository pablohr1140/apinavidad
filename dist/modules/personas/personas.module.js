"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonasModule = void 0;
const common_1 = require("@nestjs/common");
const personas_controller_1 = require("./personas.controller");
const ListPersonasUseCase_1 = require("../../application/use-cases/personas/ListPersonasUseCase");
const CreatePersonaUseCase_1 = require("../../application/use-cases/personas/CreatePersonaUseCase");
const GetPersonaUseCase_1 = require("../../application/use-cases/personas/GetPersonaUseCase");
const UpdatePersonaUseCase_1 = require("../../application/use-cases/personas/UpdatePersonaUseCase");
const DeletePersonaUseCase_1 = require("../../application/use-cases/personas/DeletePersonaUseCase");
const PersonaRepository_1 = require("../../application/repositories/PersonaRepository");
const PrismaPersonaRepository_1 = require("../../infra/database/repositories/PrismaPersonaRepository");
const logs_module_1 = require("../logs/logs.module");
let PersonasModule = class PersonasModule {
};
exports.PersonasModule = PersonasModule;
exports.PersonasModule = PersonasModule = __decorate([
    (0, common_1.Module)({
        imports: [logs_module_1.LogsModule],
        controllers: [personas_controller_1.PersonasController],
        providers: [
            ListPersonasUseCase_1.ListPersonasUseCase,
            CreatePersonaUseCase_1.CreatePersonaUseCase,
            GetPersonaUseCase_1.GetPersonaUseCase,
            UpdatePersonaUseCase_1.UpdatePersonaUseCase,
            DeletePersonaUseCase_1.DeletePersonaUseCase,
            PrismaPersonaRepository_1.PrismaPersonaRepository,
            { provide: PersonaRepository_1.PersonaRepository, useExisting: PrismaPersonaRepository_1.PrismaPersonaRepository }
        ],
        exports: [PersonaRepository_1.PersonaRepository]
    })
], PersonasModule);
