/**
 * # Periodo DTOs
 * Propósito: DTOs para Periodo DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

export const periodoBaseSchema = z.object({
  nombre: z.string().min(3),
  fecha_inicio: z.coerce.date().optional().nullable(),
  fecha_fin: z.coerce.date().optional().nullable(),
  estado_periodo: z.enum(['borrador', 'planificado', 'abierto', 'cerrado']).default('borrador'),
  es_activo: z.boolean().default(false)
});

export const createPeriodoSchema = periodoBaseSchema;
export const updatePeriodoSchema = periodoBaseSchema.partial();

export type CreatePeriodoDTO = z.infer<typeof createPeriodoSchema>;
export type UpdatePeriodoDTO = z.infer<typeof updatePeriodoSchema>;
