"use strict";
/**
 * # Get Periodo Use Case
 * Prop3sito: Caso de uso Get Periodo Use Case
 * Pertenece a: Aplicacibn / Caso de uso
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
exports.GetPeriodoUseCase = void 0;
/**
 * # GetPeriodoUseCase
 *
 * Propbc3sito: obtener un periodo por id con manejo de 404.
 * Pertenece a: Application layer.
 * Interacciones: `PeriodoRepository` y `AppError` para not found.
 */
const common_1 = require("@nestjs/common");
const PeriodoRepository_1 = require("../../repositories/PeriodoRepository");
const AppError_1 = require("../../../shared/errors/AppError");
let GetPeriodoUseCase = class GetPeriodoUseCase {
    periodoRepository;
    constructor(periodoRepository) {
        this.periodoRepository = periodoRepository;
    }
    /**
     * Busca un periodo por id; lanza 404 si no existe.
     * @param id - identificador del periodo.
     */
    async execute(id) {
        const periodo = await this.periodoRepository.findById(id);
        if (!periodo) {
            throw new AppError_1.AppError('Periodo no encontrado', 404);
        }
        return periodo;
    }
};
exports.GetPeriodoUseCase = GetPeriodoUseCase;
exports.GetPeriodoUseCase = GetPeriodoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PeriodoRepository_1.PeriodoRepository])
], GetPeriodoUseCase);
