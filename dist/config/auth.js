"use strict";
/**
 * # auth
 * Propósito: Config auth
 * Pertenece a: Configuración
 * Interacciones: Variables de entorno, bootstrap
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCookieOptions = exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = exports.REFRESH_TOKEN_TTL_MINUTES = exports.ACCESS_TOKEN_TTL_MINUTES = void 0;
const env_1 = require("./env");
exports.ACCESS_TOKEN_TTL_MINUTES = 15;
exports.REFRESH_TOKEN_TTL_MINUTES = 60 * 24 * 7;
exports.ACCESS_TOKEN_COOKIE_NAME = 'infancias_access_token';
exports.REFRESH_TOKEN_COOKIE_NAME = 'infancias_refresh_token';
const secureCookies = env_1.env.NODE_ENV !== 'development';
const baseCookieOptions = {
    httpOnly: true,
    secure: secureCookies,
    sameSite: 'lax',
    path: '/'
};
if (env_1.env.COOKIE_DOMAIN) {
    baseCookieOptions.domain = env_1.env.COOKIE_DOMAIN;
}
/**
 * Construye opciones de cookie para un TTL dado en minutos.
 * @param ttlMinutes - tiempo de vida en minutos para la cookie.
 * @returns opciones combinadas (httpOnly, secure, sameSite, dominio opcional, maxAge).
 */
const buildCookieOptions = (ttlMinutes) => ({
    ...baseCookieOptions,
    maxAge: ttlMinutes * 60 * 1000
});
exports.buildCookieOptions = buildCookieOptions;
