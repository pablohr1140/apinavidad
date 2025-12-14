"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPOSITORY_TOKENS = void 0;
/**
 * # REPOSITORY_TOKENS
 *
 * Propósito: mapa de tokens de inyección para repositorios de la capa Application.
 * Pertenece a: Application layer (config de DI).
 * Interacciones: usados en módulos/infra para vincular implementaciones.
 */
exports.REPOSITORY_TOKENS = {
    persona: Symbol('PersonaRepository'),
    organizacion: Symbol('OrganizacionRepository'),
    periodo: Symbol('PeriodoRepository'),
    nino: Symbol('NinoRepository'),
    discapacidad: Symbol('DiscapacidadRepository'),
    log: Symbol('LogRepository'),
    user: Symbol('UserRepository')
};
