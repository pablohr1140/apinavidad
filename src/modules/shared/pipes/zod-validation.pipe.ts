/**
 * # zod validation.pipe
 * Propósito: Pipe de validación/transformación zod validation.pipe
 * Pertenece a: Pipe (Nest)
 * Interacciones: DTOs, validación
 */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new BadRequestException(firstError?.message ?? 'Datos inválidos');
    }
    return result.data;
  }
}
