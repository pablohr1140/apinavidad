"use strict";
/**
 * # env
 * Propósito: Config env
 * Pertenece a: Configuración
 * Interacciones: Variables de entorno, bootstrap
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
/**
 * # config/env.ts
 *
 * Propósito: cargar variables de entorno y validarlas con Zod para exponer configuración tipada.
 * Responsabilidades: definir esquema (`envSchema`), parsear `process.env` y proveer `env` seguro.
 * Interacciones: usado por bootstrap (`main.ts`), configuración de auth/cookies, base de datos y Redis.
 * Pertenece a: capa de configuración.
 */
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    PASETO_SECRET: zod_1.z.string().min(64, 'PASETO secret must be at least 64 characters'),
    WEB_APP_ORIGIN: zod_1.z.string().optional(),
    COOKIE_DOMAIN: zod_1.z.string().optional(),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.coerce.number().default(1433),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    DEFAULT_ADMIN_EMAIL: zod_1.z.string().email(),
    DEFAULT_ADMIN_PASSWORD: zod_1.z.string().min(8),
    REDIS_URL: zod_1.z.string().url().optional(),
    REDIS_HOST: zod_1.z.string().optional(),
    REDIS_PORT: zod_1.z.coerce.number().optional(),
    REDIS_PASSWORD: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string().optional()
});
/**
 * Configuración validada de entorno. Lanza si faltan variables requeridas o son inválidas.
 */
exports.env = envSchema.parse(process.env);
