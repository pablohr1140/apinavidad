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
exports.ListNinosUseCase = void 0;
/**
 * # ListNinosUseCase
 *
 * Propósito: listar niños con filtros (organización, periodo, estado, edad/prioridad).
 * Pertenece a: Application layer.
 * Interacciones: depende de `NinoRepository` (Prisma).
 */
const common_1 = require("@nestjs/common");
const NinoRepository_1 = require("../../repositories/NinoRepository");
let ListNinosUseCase = class ListNinosUseCase {
    ninoRepository;
    constructor(ninoRepository) {
        this.ninoRepository = ninoRepository;
    }
    /**
     * Delegación de búsqueda al repositorio con filtros opcionales.
     * @param params - filtros permitidos por `findMany`.
     */
    execute(params) {
        return this.ninoRepository.findMany(params);
    }
};
exports.ListNinosUseCase = ListNinosUseCase;
exports.ListNinosUseCase = ListNinosUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [NinoRepository_1.NinoRepository])
], ListNinosUseCase);
