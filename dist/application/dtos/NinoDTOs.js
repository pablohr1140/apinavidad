"use strict";
/**
 * # Nino DTOs
 * Propósito: DTOs para Nino DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoInhabilitarSchema = exports.inhabilitarNinoSchema = exports.updateNinoSchema = exports.createNinoSchema = exports.ninoBaseSchema = void 0;
const zod_1 = require("zod");
const ninoRules_1 = require("../../domain/services/ninoRules");
const estadosNino = ['registrado', 'inhabilitado'];
const ninoCoreSchema = zod_1.z.object({
    nombres: zod_1.z.string().min(3),
    apellidos: zod_1.z.string().min(3).optional().nullable(),
    documento_numero: zod_1.z.string().min(3).optional().nullable(),
    run: zod_1.z.string().min(3).optional().nullable(),
    dv: zod_1.z.string().min(1).optional().nullable(),
    tipoDocumentoId: zod_1.z.number().int().optional().nullable(),
    nacionalidadId: zod_1.z.number().int().optional().nullable(),
    etniaId: zod_1.z.number().int().optional().nullable(),
    personaRegistroId: zod_1.z.number().int().optional().nullable(),
    fecha_nacimiento: zod_1.z.coerce.date().optional().nullable(),
    sexo: zod_1.z.enum(['M', 'F', 'X']).optional().nullable(),
    organizacionId: zod_1.z.number().int().optional().nullable(),
    periodoId: zod_1.z.number().int(),
    edad: zod_1.z.number().int().min(0).max(ninoRules_1.MAX_EDAD).optional().nullable(),
    tiene_discapacidad: zod_1.z.boolean().default(false),
    tiene_RSH: zod_1.z.boolean().default(false),
    fecha_ingreso: zod_1.z.coerce.date().optional().nullable(),
    fecha_retiro: zod_1.z.coerce.date().optional().nullable(),
    estado: zod_1.z.enum(estadosNino).default('registrado')
});
exports.ninoBaseSchema = ninoCoreSchema;
exports.createNinoSchema = exports.ninoBaseSchema;
exports.updateNinoSchema = ninoCoreSchema.partial();
exports.inhabilitarNinoSchema = zod_1.z.object({
    fecha: zod_1.z.coerce.date(),
    motivo: zod_1.z.string().min(3)
});
exports.autoInhabilitarSchema = zod_1.z.object({
    dryRun: zod_1.z.boolean().optional().default(false),
    fechaReferencia: zod_1.z.coerce.date().optional()
});
