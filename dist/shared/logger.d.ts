/**
 * # logger
 * Propósito: Utilidades compartidas logger
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
import { type LoggerOptions } from 'pino';
export interface LoggerEnvConfig {
    level: string;
    nodeEnv: string;
}
export declare const buildLoggerOptions: (config: LoggerEnvConfig) => LoggerOptions;
export declare const logger: import("pino").Logger<never, boolean>;
