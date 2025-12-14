/**
 * # Organizacion DTOs
 * Propósito: DTOs para Organizacion DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

export const organizacionBaseSchema = z.object({
  nombre: z.string().min(3),
  sigla: z.string().max(50).optional().nullable(),
  rut: z.string().min(5).max(12).optional().nullable(),
  tipo: z.string().min(2).default('otro'),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  providenciaId: z.number().int().optional().nullable(),
  estado: z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
});

export const createOrganizacionSchema = organizacionBaseSchema;
export const updateOrganizacionSchema = organizacionBaseSchema.partial();

export type CreateOrganizacionDTO = z.infer<typeof createOrganizacionSchema>;
export type UpdateOrganizacionDTO = z.infer<typeof updateOrganizacionSchema>;
