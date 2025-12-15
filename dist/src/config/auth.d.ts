/**
 * # auth
 * Propósito: Config auth
 * Pertenece a: Configuración
 * Interacciones: Variables de entorno, bootstrap
 */
/**
 * # config/auth.ts
 *
 * Propósito: centralizar configuración de autenticación basada en cookies para tokens PASETO.
 * Responsabilidades: TTL de access/refresh, nombres de cookies y opciones comunes (secure, domain, sameSite).
 * Interacciones: usado por controladores/guards que emiten o leen cookies de acceso/refresh.
 * Pertenece a: capa de configuración.
 */
import type { CookieOptions } from 'express';
export declare const ACCESS_TOKEN_TTL_MINUTES = 15;
export declare const REFRESH_TOKEN_TTL_MINUTES: number;
export declare const ACCESS_TOKEN_COOKIE_NAME = "infancias_access_token";
export declare const REFRESH_TOKEN_COOKIE_NAME = "infancias_refresh_token";
/**
 * Construye opciones de cookie para un TTL dado en minutos.
 * @param ttlMinutes - tiempo de vida en minutos para la cookie.
 * @returns opciones combinadas (httpOnly, secure, sameSite, dominio opcional, maxAge).
 */
export declare const buildCookieOptions: (ttlMinutes: number) => CookieOptions;
