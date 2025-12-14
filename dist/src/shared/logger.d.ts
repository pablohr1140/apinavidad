import pino, { LoggerOptions } from 'pino';
export interface LoggerEnvConfig {
    level: string;
    nodeEnv: string;
}
export declare const buildLoggerOptions: (config: LoggerEnvConfig) => LoggerOptions;
export declare const logger: pino.Logger<never, boolean>;
