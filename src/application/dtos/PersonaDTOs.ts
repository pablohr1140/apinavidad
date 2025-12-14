/**
 * # Persona DTOs
 * Propósito: DTOs para Persona DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

import { ROLE_KEYS, RoleKey } from '@/domain/access-control';

const RoleKeyEnum = z.enum([...ROLE_KEYS] as [RoleKey, ...RoleKey[]]);

export const personaBaseSchema = z.object({
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  run: z.string().min(5).optional().nullable(),
  dv: z.string().min(1).max(2).optional().nullable(),
  fecha_nacimiento: z.coerce.date().optional().nullable(),
  sexo: z.enum(['M', 'F', 'X']).optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  email_verified_at: z.coerce.date().optional().nullable(),
  password: z.string().min(8).optional().nullable(),
  rememberToken: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  providenciaId: z.number().int().optional().nullable(),
  esRepresentante: z.boolean().optional().default(false),
  roles: z.array(RoleKeyEnum).optional()
});

export const createPersonaSchema = personaBaseSchema;
export const updatePersonaSchema = personaBaseSchema.partial();

export type CreatePersonaDTO = z.infer<typeof createPersonaSchema>;
export type UpdatePersonaDTO = z.infer<typeof updatePersonaSchema>;
