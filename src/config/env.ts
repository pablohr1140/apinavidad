/**
 * config/env.ts
 * Capa: Configuración
 * Responsabilidad: Validar con Zod las variables de entorno y exponer un objeto `env` tipado y único para toda la app.
 * Alcance: puerto/log level, PASETO y cookies, SQL Server (host/puerto/pool/timeouts), Redis, credenciales admin seed, `DATABASE_URL` para Prisma.
 * Interacciones: usado en bootstrap (`main.ts`), módulos de Auth/DB/Cache; falla en arranque si falta o es inválida una variable requerida.
 * Notas: `DATABASE_URL` se usa solo por Prisma; el driver MSSQL usa los campos `DB_*`. Ajusta defaults seguros para tiempo de espera y pool.
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
  DB_POOL_MAX: z.coerce.number().min(1).max(50).default(10),
  DB_POOL_MIN: z.coerce.number().min(0).max(20).default(0),
  DB_POOL_IDLE_TIMEOUT_MS: z.coerce.number().min(1000).max(600000).default(10000),
  DB_POOL_CONNECT_TIMEOUT_MS: z.coerce.number().min(1000).max(600000).default(10000),
  DB_REQUEST_TIMEOUT_MS: z.coerce.number().min(1000).max(600000).default(20000),
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
