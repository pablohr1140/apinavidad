/**
 * # Organizacion DTOs
 * Propósito: DTOs para Organizacion DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
import { z } from 'zod';
export declare const organizacionBaseSchema: z.ZodObject<{
    nombre: z.ZodString;
    sigla: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    rut: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tipo: z.ZodDefault<z.ZodString>;
    direccion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefono: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    providenciaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    estado: z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>;
}, "strip", z.ZodTypeAny, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    providenciaId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
}>;
export declare const createOrganizacionSchema: z.ZodObject<{
    nombre: z.ZodString;
    sigla: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    rut: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tipo: z.ZodDefault<z.ZodString>;
    direccion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefono: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    providenciaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    estado: z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>;
}, "strip", z.ZodTypeAny, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    providenciaId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
}>;
export declare const updateOrganizacionSchema: z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    sigla: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    rut: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    tipo: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    direccion: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    telefono: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    providenciaId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    estado: z.ZodOptional<z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
}, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
}>;
export type CreateOrganizacionDTO = z.infer<typeof createOrganizacionSchema>;
export type UpdateOrganizacionDTO = z.infer<typeof updateOrganizacionSchema>;
