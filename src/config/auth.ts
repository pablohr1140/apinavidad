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

import { env } from './env';

export const ACCESS_TOKEN_TTL_MINUTES = 15;
export const REFRESH_TOKEN_TTL_MINUTES = 60 * 24 * 7;

export const ACCESS_TOKEN_COOKIE_NAME = 'infancias_access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'infancias_refresh_token';

const secureCookies = env.NODE_ENV !== 'development';
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: 'lax',
  path: '/'
};

if (env.COOKIE_DOMAIN) {
  baseCookieOptions.domain = env.COOKIE_DOMAIN;
}

/**
 * Construye opciones de cookie para un TTL dado en minutos.
 * @param ttlMinutes - tiempo de vida en minutos para la cookie.
 * @returns opciones combinadas (httpOnly, secure, sameSite, dominio opcional, maxAge).
 */
export const buildCookieOptions = (ttlMinutes: number): CookieOptions => ({
  ...baseCookieOptions,
  maxAge: ttlMinutes * 60 * 1000
});
