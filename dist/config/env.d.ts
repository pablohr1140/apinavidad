/**
 * # env
 * Propósito: Config env
 * Pertenece a: Configuración
 * Interacciones: Variables de entorno, bootstrap
 */
/**
 * # config/env.ts
 *
 * Propósito: cargar variables de entorno y validarlas con Zod para exponer configuración tipada.
 * Responsabilidades: definir esquema (`envSchema`), parsear `process.env` y proveer `env` seguro.
 * Interacciones: usado por bootstrap (`main.ts`), configuración de auth/cookies, base de datos y Redis.
 * Pertenece a: capa de configuración.
 */
import 'dotenv/config';
/**
 * Configuración validada de entorno. Lanza si faltan variables requeridas o son inválidas.
 */
export declare const env: {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
    PASETO_SECRET: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DEFAULT_ADMIN_EMAIL: string;
    DEFAULT_ADMIN_PASSWORD: string;
    WEB_APP_ORIGIN?: string | undefined;
    COOKIE_DOMAIN?: string | undefined;
    REDIS_URL?: string | undefined;
    REDIS_HOST?: string | undefined;
    REDIS_PORT?: number | undefined;
    REDIS_PASSWORD?: string | undefined;
    DATABASE_URL?: string | undefined;
};
