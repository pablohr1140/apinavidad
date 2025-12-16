/**
 * # Organizacion DTOs
 * Propósito: DTOs para Organizacion DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
import { z } from 'zod';
export declare const organizacionBaseSchema: z.ZodEffects<z.ZodObject<{
    nombre: z.ZodString;
    tipo: z.ZodDefault<z.ZodString>;
    direccion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefono: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    providenciaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    sectorId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    estado: z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>;
}, "strip", z.ZodTypeAny, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>;
export declare const createOrganizacionSchema: z.ZodEffects<z.ZodObject<{
    nombre: z.ZodString;
    tipo: z.ZodDefault<z.ZodString>;
    direccion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    telefono: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    providenciaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    sectorId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    estado: z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>;
}, "strip", z.ZodTypeAny, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>, {
    estado: "borrador" | "activo" | "suspendido";
    nombre: string;
    tipo: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>;
export declare const updateOrganizacionSchema: z.ZodEffects<z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    tipo: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    direccion: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    telefono: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    providenciaId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    sectorId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    estado: z.ZodOptional<z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>>;
}, "strip", z.ZodTypeAny, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
    nombre?: string | undefined;
    tipo?: string | undefined;
    providenciaId?: number | null | undefined;
    sectorId?: number | null | undefined;
}>;
export type CreateOrganizacionDTO = z.infer<typeof createOrganizacionSchema>;
export type UpdateOrganizacionDTO = z.infer<typeof updateOrganizacionSchema>;
export declare const createOrganizacionConProvidenciaSchema: z.ZodObject<{
    providencia: z.ZodObject<{
        nombre: z.ZodString;
        codigo: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        codigo: string;
    }, {
        nombre: string;
        codigo: string;
    }>;
    organizacion: z.ZodObject<{
        nombre: z.ZodString;
        tipo: z.ZodLiteral<"Providencia">;
        direccion: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        telefono: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        email: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sectorId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        estado: z.ZodDefault<z.ZodEnum<["borrador", "activo", "suspendido"]>>;
    }, "strip", z.ZodTypeAny, {
        estado: "borrador" | "activo" | "suspendido";
        nombre: string;
        tipo: "Providencia";
        email?: string | null | undefined;
        telefono?: string | null | undefined;
        direccion?: string | null | undefined;
        sectorId?: number | null | undefined;
    }, {
        nombre: string;
        tipo: "Providencia";
        email?: string | null | undefined;
        telefono?: string | null | undefined;
        direccion?: string | null | undefined;
        estado?: "borrador" | "activo" | "suspendido" | undefined;
        sectorId?: number | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    providencia: {
        nombre: string;
        codigo: string;
    };
    organizacion: {
        estado: "borrador" | "activo" | "suspendido";
        nombre: string;
        tipo: "Providencia";
        email?: string | null | undefined;
        telefono?: string | null | undefined;
        direccion?: string | null | undefined;
        sectorId?: number | null | undefined;
    };
}, {
    providencia: {
        nombre: string;
        codigo: string;
    };
    organizacion: {
        nombre: string;
        tipo: "Providencia";
        email?: string | null | undefined;
        telefono?: string | null | undefined;
        direccion?: string | null | undefined;
        estado?: "borrador" | "activo" | "suspendido" | undefined;
        sectorId?: number | null | undefined;
    };
}>;
export type CreateOrganizacionConProvidenciaDTO = z.infer<typeof createOrganizacionConProvidenciaSchema>;
