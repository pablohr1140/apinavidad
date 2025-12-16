"use strict";
/**
 * # List Periodos Use Case
 * Propósito: Caso de uso List Periodos Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPeriodosUseCase = void 0;
/**
 * # ListPeriodosUseCase
 *
 * Propósito: listar periodos con filtros opcionales (estado, activo).
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository`.
 */
const common_1 = require("@nestjs/common");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
let ListPeriodosUseCase = class ListPeriodosUseCase {
    periodoRepository;
    constructor(periodoRepository) {
        this.periodoRepository = periodoRepository;
    }
    /**
     * Delegación de filtros al repositorio para obtener periodos.
     * @param params - filtros opcionales.
     */
    execute(params) {
        return this.periodoRepository.findMany(params);
    }
};
exports.ListPeriodosUseCase = ListPeriodosUseCase;
exports.ListPeriodosUseCase = ListPeriodosUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository])
], ListPeriodosUseCase);
