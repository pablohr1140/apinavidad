/**
 * # logger
 * Propósito: Utilidades compartidas logger
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */

import { pino, type LoggerOptions } from 'pino';

import { env } from '@/config/env';

export interface LoggerEnvConfig {
  level: string;
  nodeEnv: string;
}

export const buildLoggerOptions = (config: LoggerEnvConfig): LoggerOptions => ({
  level: config.level,
  ...(config.nodeEnv === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss'
          }
        }
      }
    : {})
});

export const logger = pino(buildLoggerOptions({ level: env.LOG_LEVEL, nodeEnv: env.NODE_ENV }));
