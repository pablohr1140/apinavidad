/**
 * # tokens
 * Propósito: Contrato de repositorio tokens
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */
/**
 * # REPOSITORY_TOKENS
 *
 * Propósito: mapa de tokens de inyección para repositorios de la capa Application.
 * Pertenece a: Application layer (config de DI).
 * Interacciones: usados en módulos/infra para vincular implementaciones.
 */
export declare const REPOSITORY_TOKENS: {
    readonly persona: symbol;
    readonly organizacion: symbol;
    readonly periodo: symbol;
    readonly nino: symbol;
    readonly discapacidad: symbol;
    readonly log: symbol;
    readonly user: symbol;
};
