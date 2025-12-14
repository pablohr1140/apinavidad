/**
 * # Zod Validation Pipe.spec
 * Propósito: Prueba unitaria Zod Validation Pipe.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { BadRequestException } from '@nestjs/common';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({ name: z.string().min(3) });
  const pipe = new ZodValidationPipe(schema);

  it('devuelve los datos parseados cuando son válidos', () => {
    const value = { name: 'john' };

    expect(pipe.transform(value)).toEqual(value);
  });

  it('lanza BadRequestException cuando los datos son inválidos', () => {
    expect(() => pipe.transform({ name: 'aa' })).toThrow(BadRequestException);
  });
});
