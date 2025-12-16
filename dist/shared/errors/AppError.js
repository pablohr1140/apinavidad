"use strict";
/**
 * # App Error
 * Propósito: Utilidades compartidas App Error
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    metadata;
    constructor(message, statusCode = 400, metadata) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}
exports.AppError = AppError;
