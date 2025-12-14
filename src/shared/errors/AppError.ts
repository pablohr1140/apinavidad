/**
 * # App Error
 * Propósito: Utilidades compartidas App Error
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode = 400,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
  }
}
