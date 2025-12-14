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
    nombre: string;
    tipo: string;
    estado: "borrador" | "activo" | "suspendido";
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
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
    nombre: string;
    tipo: string;
    estado: "borrador" | "activo" | "suspendido";
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
}, {
    nombre: string;
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
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
    providenciaId?: number | null | undefined;
    nombre?: string | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
}, {
    email?: string | null | undefined;
    telefono?: string | null | undefined;
    direccion?: string | null | undefined;
    providenciaId?: number | null | undefined;
    nombre?: string | undefined;
    sigla?: string | null | undefined;
    rut?: string | null | undefined;
    tipo?: string | undefined;
    estado?: "borrador" | "activo" | "suspendido" | undefined;
}>;
export type CreateOrganizacionDTO = z.infer<typeof createOrganizacionSchema>;
export type UpdateOrganizacionDTO = z.infer<typeof updateOrganizacionSchema>;
