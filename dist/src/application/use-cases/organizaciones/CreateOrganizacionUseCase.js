"use strict";
/**
 * # Create Organizacion Use Case
 * Propósito: Caso de uso Create Organizacion Use Case
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
exports.CreateOrganizacionUseCase = void 0;
/**
 * # CreateOrganizacionUseCase
 *
 * Propósito: crear organizaciones validando DTO con Zod y registrando auditoría.
 * Pertenece a: Application layer; coordina validación + repositorio + logging.
 * Interacciones: usa `createOrganizacionSchema`, `OrganizacionRepository` y `LogActivityUseCase`.
 */
const common_1 = require("@nestjs/common");
const OrganizacionDTOs_1 = require("../../dtos/OrganizacionDTOs");
const OrganizacionRepository_1 = require("../../repositories/OrganizacionRepository");
const LogActivityUseCase_1 = require("../logs/LogActivityUseCase");
let CreateOrganizacionUseCase = class CreateOrganizacionUseCase {
    organizacionRepository;
    logActivityUseCase;
    constructor(organizacionRepository, logActivityUseCase = LogActivityUseCase_1.noopLogActivity) {
        this.organizacionRepository = organizacionRepository;
        this.logActivityUseCase = logActivityUseCase;
    }
    /**
     * Valida el payload de creación, delega al repositorio y registra actividad.
     * @param data - entrada cruda (validada con Zod antes de persistir).
     * @returns organización creada.
     */
    execute(data) {
        const payload = OrganizacionDTOs_1.createOrganizacionSchema.parse(data);
        return this.organizacionRepository.create(payload).then((created) => {
            void this.logActivityUseCase.execute({
                accion: 'organizacion.creada',
                mensaje: 'Se creó una organización',
                loggableType: 'organizacion',
                loggableId: created.id,
                payload: {
                    nombre: created.nombre,
                    estado: created.estado,
                    tipo: created.tipo
                }
            });
            return created;
        });
    }
};
exports.CreateOrganizacionUseCase = CreateOrganizacionUseCase;
exports.CreateOrganizacionUseCase = CreateOrganizacionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [OrganizacionRepository_1.OrganizacionRepository,
        LogActivityUseCase_1.LogActivityUseCase])
], CreateOrganizacionUseCase);
