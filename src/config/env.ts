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
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  PASETO_SECRET: z.string().min(64, 'PASETO secret must be at least 64 characters'),
  WEB_APP_ORIGIN: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(1433),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DEFAULT_ADMIN_EMAIL: z.string().email(),
  DEFAULT_ADMIN_PASSWORD: z.string().min(8),
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_PASSWORD: z.string().optional(),
  DATABASE_URL: z.string().optional()
});

/**
 * Configuración validada de entorno. Lanza si faltan variables requeridas o son inválidas.
 */
export const env = envSchema.parse(process.env);
