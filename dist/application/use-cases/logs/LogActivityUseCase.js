"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noopLogActivity = exports.LogActivityUseCase = void 0;
/**
 * # LogActivityUseCase
 *
 * Propósito: registrar actividades/auditoría en el repositorio de logs.
 * Pertenece a: Application layer.
 * Interacciones: `LogRepository`.
 */
const common_1 = require("@nestjs/common");
const LogRepository_1 = require("../../repositories/LogRepository");
let LogActivityUseCase = class LogActivityUseCase {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    /**
     * Persiste la actividad con timestamp actual.
     * @param input - datos de actividad a registrar.
     */
    execute(input) {
        return this.logRepository.create({
            ...input,
            createdAt: new Date()
        });
    }
};
exports.LogActivityUseCase = LogActivityUseCase;
exports.LogActivityUseCase = LogActivityUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [LogRepository_1.LogRepository])
], LogActivityUseCase);
// No-op logger used as default in unit tests to avoid wiring Nest providers
exports.noopLogActivity = { execute: async () => undefined };
