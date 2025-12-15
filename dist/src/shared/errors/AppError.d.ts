/**
 * # App Error
 * Propósito: Utilidades compartidas App Error
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
export declare class AppError extends Error {
    readonly message: string;
    readonly statusCode: number;
    readonly metadata?: Record<string, unknown> | undefined;
    constructor(message: string, statusCode?: number, metadata?: Record<string, unknown> | undefined);
}
