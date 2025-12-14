/**
 * # Auth DTOs
 * Propósito: DTOs para Auth DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(1).optional()
});

export type RefreshRequestDTO = z.infer<typeof refreshRequestSchema>;
