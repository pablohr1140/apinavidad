"use strict";
/**
 * # Get Nino Use Case
 * Propósito: Caso de uso Get Nino Use Case
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
exports.GetNinoUseCase = void 0;
/**
 * # GetNinoUseCase
 *
 * Propósito: obtener un niño por id, retornando 404 si no existe.
 * Pertenece a: Application layer.
 * Interacciones: `NinoRepository`, `AppError`.
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
const AppError_1 = require("../../../shared/errors/AppError");
let GetNinoUseCase = class GetNinoUseCase {
    ninoRepository;
    constructor(ninoRepository) {
        this.ninoRepository = ninoRepository;
    }
    /**
     * Busca un niño por id y lanza `AppError` 404 si no se encuentra.
     * @param id - identificador del niño.
     */
    async execute(id) {
        const nino = await this.ninoRepository.findById(id);
        if (!nino) {
            throw new AppError_1.AppError('Niño no encontrado', 404);
        }
        return nino;
    }
};
exports.GetNinoUseCase = GetNinoUseCase;
exports.GetNinoUseCase = GetNinoUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository])
], GetNinoUseCase);
