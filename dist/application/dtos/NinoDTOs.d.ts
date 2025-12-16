/**
 * # Nino DTOs
 * Propósito: DTOs para Nino DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
import { z } from 'zod';
export declare const ninoBaseSchema: z.ZodObject<{
    nombres: z.ZodString;
    apellidos: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    documento_numero: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    run: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dv: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tipoDocumentoId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    nacionalidadId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    etniaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    personaRegistroId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    fecha_nacimiento: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    sexo: z.ZodNullable<z.ZodOptional<z.ZodEnum<["M", "F", "X"]>>>;
    organizacionId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    periodoId: z.ZodNumber;
    edad: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    tiene_discapacidad: z.ZodDefault<z.ZodBoolean>;
    tiene_RSH: z.ZodDefault<z.ZodBoolean>;
    fecha_ingreso: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    fecha_retiro: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    estado: z.ZodDefault<z.ZodEnum<["registrado", "inhabilitado"]>>;
}, "strip", z.ZodTypeAny, {
    nombres: string;
    estado: "registrado" | "inhabilitado";
    periodoId: number;
    tiene_discapacidad: boolean;
    tiene_RSH: boolean;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    edad?: number | null | undefined;
    fecha_ingreso?: Date | null | undefined;
}, {
    nombres: string;
    periodoId: number;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    estado?: "registrado" | "inhabilitado" | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    edad?: number | null | undefined;
    tiene_discapacidad?: boolean | undefined;
    tiene_RSH?: boolean | undefined;
    fecha_ingreso?: Date | null | undefined;
}>;
export declare const createNinoSchema: z.ZodObject<{
    nombres: z.ZodString;
    apellidos: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    documento_numero: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    run: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dv: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tipoDocumentoId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    nacionalidadId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    etniaId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    personaRegistroId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    fecha_nacimiento: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    sexo: z.ZodNullable<z.ZodOptional<z.ZodEnum<["M", "F", "X"]>>>;
    organizacionId: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    periodoId: z.ZodNumber;
    edad: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    tiene_discapacidad: z.ZodDefault<z.ZodBoolean>;
    tiene_RSH: z.ZodDefault<z.ZodBoolean>;
    fecha_ingreso: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    fecha_retiro: z.ZodNullable<z.ZodOptional<z.ZodDate>>;
    estado: z.ZodDefault<z.ZodEnum<["registrado", "inhabilitado"]>>;
}, "strip", z.ZodTypeAny, {
    nombres: string;
    estado: "registrado" | "inhabilitado";
    periodoId: number;
    tiene_discapacidad: boolean;
    tiene_RSH: boolean;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    edad?: number | null | undefined;
    fecha_ingreso?: Date | null | undefined;
}, {
    nombres: string;
    periodoId: number;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    estado?: "registrado" | "inhabilitado" | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    edad?: number | null | undefined;
    tiene_discapacidad?: boolean | undefined;
    tiene_RSH?: boolean | undefined;
    fecha_ingreso?: Date | null | undefined;
}>;
export declare const updateNinoSchema: z.ZodObject<{
    nombres: z.ZodOptional<z.ZodString>;
    apellidos: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    documento_numero: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    run: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    dv: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    tipoDocumentoId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    nacionalidadId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    etniaId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    personaRegistroId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    fecha_nacimiento: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    sexo: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodEnum<["M", "F", "X"]>>>>;
    organizacionId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    periodoId: z.ZodOptional<z.ZodNumber>;
    edad: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    tiene_discapacidad: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tiene_RSH: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    fecha_ingreso: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    fecha_retiro: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodDate>>>;
    estado: z.ZodOptional<z.ZodDefault<z.ZodEnum<["registrado", "inhabilitado"]>>>;
}, "strip", z.ZodTypeAny, {
    nombres?: string | undefined;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    estado?: "registrado" | "inhabilitado" | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    periodoId?: number | undefined;
    edad?: number | null | undefined;
    tiene_discapacidad?: boolean | undefined;
    tiene_RSH?: boolean | undefined;
    fecha_ingreso?: Date | null | undefined;
}, {
    nombres?: string | undefined;
    apellidos?: string | null | undefined;
    run?: string | null | undefined;
    dv?: string | null | undefined;
    fecha_nacimiento?: Date | null | undefined;
    sexo?: "M" | "F" | "X" | null | undefined;
    estado?: "registrado" | "inhabilitado" | undefined;
    fecha_retiro?: Date | null | undefined;
    documento_numero?: string | null | undefined;
    tipoDocumentoId?: number | null | undefined;
    nacionalidadId?: number | null | undefined;
    etniaId?: number | null | undefined;
    personaRegistroId?: number | null | undefined;
    organizacionId?: number | null | undefined;
    periodoId?: number | undefined;
    edad?: number | null | undefined;
    tiene_discapacidad?: boolean | undefined;
    tiene_RSH?: boolean | undefined;
    fecha_ingreso?: Date | null | undefined;
}>;
export declare const inhabilitarNinoSchema: z.ZodObject<{
    fecha: z.ZodDate;
    motivo: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fecha: Date;
    motivo: string;
}, {
    fecha: Date;
    motivo: string;
}>;
export declare const autoInhabilitarSchema: z.ZodObject<{
    dryRun: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    fechaReferencia: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    dryRun: boolean;
    fechaReferencia?: Date | undefined;
}, {
    dryRun?: boolean | undefined;
    fechaReferencia?: Date | undefined;
}>;
export type CreateNinoDTO = z.infer<typeof createNinoSchema>;
export type UpdateNinoDTO = z.infer<typeof updateNinoSchema>;
export type InhabilitarNinoDTO = z.infer<typeof inhabilitarNinoSchema>;
export type AutoInhabilitarNinosDTO = z.infer<typeof autoInhabilitarSchema>;
