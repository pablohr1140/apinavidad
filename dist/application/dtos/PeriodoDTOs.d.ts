/**
 * # Periodo DTOs
 * Propósito: DTOs para Periodo DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
import { z } from 'zod';
export declare const periodoBaseSchema: z.ZodObject<{
    nombre: z.ZodString;
    fecha_inicio: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    fecha_fin: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    estado_periodo: z.ZodDefault<z.ZodEnum<["borrador", "planificado", "abierto", "cerrado"]>>;
    es_activo: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    nombre: string;
    estado_periodo: "borrador" | "planificado" | "abierto" | "cerrado";
    es_activo: boolean;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
}, {
    nombre: string;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
    estado_periodo?: "borrador" | "planificado" | "abierto" | "cerrado" | undefined;
    es_activo?: boolean | undefined;
}>;
export declare const createPeriodoSchema: z.ZodObject<{
    nombre: z.ZodString;
    fecha_inicio: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    fecha_fin: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    estado_periodo: z.ZodDefault<z.ZodEnum<["borrador", "planificado", "abierto", "cerrado"]>>;
    es_activo: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    nombre: string;
    estado_periodo: "borrador" | "planificado" | "abierto" | "cerrado";
    es_activo: boolean;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
}, {
    nombre: string;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
    estado_periodo?: "borrador" | "planificado" | "abierto" | "cerrado" | undefined;
    es_activo?: boolean | undefined;
}>;
export declare const updatePeriodoSchema: z.ZodObject<{
    nombre: z.ZodOptional<z.ZodString>;
    fecha_inicio: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    fecha_fin: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    estado_periodo: z.ZodOptional<z.ZodDefault<z.ZodEnum<["borrador", "planificado", "abierto", "cerrado"]>>>;
    es_activo: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    nombre?: string | undefined;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
    estado_periodo?: "borrador" | "planificado" | "abierto" | "cerrado" | undefined;
    es_activo?: boolean | undefined;
}, {
    nombre?: string | undefined;
    fecha_inicio?: Date | null | undefined;
    fecha_fin?: Date | null | undefined;
    estado_periodo?: "borrador" | "planificado" | "abierto" | "cerrado" | undefined;
    es_activo?: boolean | undefined;
}>;
export type CreatePeriodoDTO = z.infer<typeof createPeriodoSchema>;
export type UpdatePeriodoDTO = z.infer<typeof updatePeriodoSchema>;
