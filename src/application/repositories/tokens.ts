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
export const REPOSITORY_TOKENS = {
  persona: Symbol('PersonaRepository'),
  organizacion: Symbol('OrganizacionRepository'),
  periodo: Symbol('PeriodoRepository'),
  nino: Symbol('NinoRepository'),
  discapacidad: Symbol('DiscapacidadRepository'),
  log: Symbol('LogRepository'),
  user: Symbol('UserRepository')
} as const;
