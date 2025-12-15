/**
 * # zod validation.pipe
 * Propósito: Pipe de validación/transformación zod validation.pipe
 * Pertenece a: Pipe (Nest)
 * Interacciones: DTOs, validación
 */
import { PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';
export declare class ZodValidationPipe implements PipeTransform {
    private readonly schema;
    constructor(schema: ZodSchema);
    transform(value: unknown): any;
}
