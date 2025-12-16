"use strict";
/**
 * # logger
 * Propósito: Utilidades compartidas logger
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.buildLoggerOptions = void 0;
const pino_1 = require("pino");
const env_1 = require("../config/env");
const buildLoggerOptions = (config) => ({
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
exports.buildLoggerOptions = buildLoggerOptions;
exports.logger = (0, pino_1.pino)((0, exports.buildLoggerOptions)({ level: env_1.env.LOG_LEVEL, nodeEnv: env_1.env.NODE_ENV }));
