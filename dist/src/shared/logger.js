"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.buildLoggerOptions = void 0;
const pino_1 = __importDefault(require("pino"));
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
exports.logger = (0, pino_1.default)((0, exports.buildLoggerOptions)({ level: env_1.env.LOG_LEVEL, nodeEnv: env_1.env.NODE_ENV }));
