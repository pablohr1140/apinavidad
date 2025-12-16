/**
 * # Organizacion DTOs
 * Propósito: DTOs para Organizacion DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

const organizacionShape = z.object({
  nombre: z.string().min(3),
  tipo: z.string().min(2).default('otro'),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  providenciaId: z.number().int().optional().nullable(),
  sectorId: z.number().int().optional().nullable(),
  estado: z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
});

export const organizacionBaseSchema = organizacionShape.superRefine((data, ctx) => {
  if (data.tipo?.toLowerCase() === 'providencia' && (data.providenciaId === null || data.providenciaId === undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El campo providenciaId es obligatorio cuando tipo=Providencia',
      path: ['providenciaId']
    });
  }
});

export const createOrganizacionSchema = organizacionBaseSchema;

export const updateOrganizacionSchema = organizacionShape.partial().superRefine((data, ctx) => {
  if (data.tipo?.toLowerCase() === 'providencia' && (data.providenciaId === null || data.providenciaId === undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'El campo providenciaId es obligatorio cuando tipo=Providencia',
      path: ['providenciaId']
    });
  }
});

export type CreateOrganizacionDTO = z.infer<typeof createOrganizacionSchema>;
export type UpdateOrganizacionDTO = z.infer<typeof updateOrganizacionSchema>;

export const createOrganizacionConProvidenciaSchema = z.object({
  providencia: z.object({
    nombre: z.string().trim().min(3),
    codigo: z.string().trim().min(1).max(10)
  }),
  organizacion: z.object({
    nombre: z.string().trim().min(3),
    tipo: z.literal('Providencia'),
    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    sectorId: z.number().int().optional().nullable(),
    estado: z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
  })
});

export type CreateOrganizacionConProvidenciaDTO = z.infer<typeof createOrganizacionConProvidenciaSchema>;
