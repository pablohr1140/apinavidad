/**
 * # Nino DTOs
 * Propósito: DTOs para Nino DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

import { MAX_EDAD } from '@/domain/services/ninoRules';

const estadosNino = ['registrado', 'inhabilitado'] as const;

const ninoCoreSchema = z.object({
  nombres: z.string().min(3),
  apellidos: z.string().min(3).optional().nullable(),
  documento_numero: z.string().min(3).optional().nullable(),
  run: z.string().min(3).optional().nullable(),
  dv: z.string().min(1).optional().nullable(),
  tipoDocumentoId: z.number().int().optional().nullable(),
  nacionalidadId: z.number().int().optional().nullable(),
  etniaId: z.number().int().optional().nullable(),
  personaRegistroId: z.number().int().optional().nullable(),
  fecha_nacimiento: z.coerce.date().optional().nullable(),
  sexo: z.enum(['M', 'F', 'X']).optional().nullable(),
  organizacionId: z.number().int().optional().nullable(),
  periodoId: z.number().int(),
  edad: z.number().int().min(0).max(MAX_EDAD).optional().nullable(),
  tiene_discapacidad: z.boolean().default(false),
  tiene_RSH: z.boolean().default(false),
  fecha_ingreso: z.coerce.date().optional().nullable(),
  fecha_retiro: z.coerce.date().optional().nullable(),
  estado: z.enum(estadosNino).default('registrado')
});

export const ninoBaseSchema = ninoCoreSchema;
export const createNinoSchema = ninoBaseSchema;
export const updateNinoSchema = ninoCoreSchema.partial();

export const inhabilitarNinoSchema = z.object({
  fecha: z.coerce.date(),
  motivo: z.string().min(3)
});

export const autoInhabilitarSchema = z.object({
  dryRun: z.boolean().optional().default(false),
  fechaReferencia: z.coerce.date().optional()
});

export type CreateNinoDTO = z.infer<typeof createNinoSchema>;
export type UpdateNinoDTO = z.infer<typeof updateNinoSchema>;
export type InhabilitarNinoDTO = z.infer<typeof inhabilitarNinoSchema>;
export type AutoInhabilitarNinosDTO = z.infer<typeof autoInhabilitarSchema>;
