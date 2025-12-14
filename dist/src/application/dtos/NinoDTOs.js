"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoInhabilitarSchema = exports.inhabilitarNinoSchema = exports.updateNinoSchema = exports.createNinoSchema = exports.ninoBaseSchema = void 0;
const zod_1 = require("zod");
const ninoRules_1 = require("../../domain/services/ninoRules");
const ninoCoreSchema = zod_1.z.object({
    nombres: zod_1.z.string().min(3),
    apellidos: zod_1.z.string().min(3).optional().nullable(),
    run: zod_1.z.string().min(5).optional().nullable(),
    dv: zod_1.z.string().min(1).max(2).optional().nullable(),
    documento: zod_1.z.string().optional().nullable(),
    fecha_nacimiento: zod_1.z.coerce.date().optional().nullable(),
    sexo: zod_1.z.enum(['M', 'F', 'X']).optional().nullable(),
    organizacionId: zod_1.z.number().int().optional().nullable(),
    periodoId: zod_1.z.number().int(),
    providenciaId: zod_1.z.number().int().optional().nullable(),
    edad: zod_1.z.number().int().min(0).max(ninoRules_1.MAX_EDAD).optional().nullable(),
    tiene_discapacidad: zod_1.z.boolean().default(false),
    fecha_ingreso: zod_1.z.coerce.date().optional().nullable(),
    fecha_retiro: zod_1.z.coerce.date().optional().nullable(),
    estado: zod_1.z.enum(['registrado', 'validado', 'egresado', 'inhabilitado']).default('registrado')
});
const withEdadValidation = (schema) => schema.superRefine((data, ctx) => {
    const edadCalculada = data.fecha_nacimiento ? (0, ninoRules_1.calcularEdad)(data.fecha_nacimiento) : undefined;
    if (edadCalculada != null && edadCalculada > ninoRules_1.MAX_EDAD) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `La edad máxima permitida es ${ninoRules_1.MAX_EDAD}`,
            path: ['fecha_nacimiento']
        });
    }
});
exports.ninoBaseSchema = withEdadValidation(ninoCoreSchema);
exports.createNinoSchema = exports.ninoBaseSchema;
exports.updateNinoSchema = withEdadValidation(ninoCoreSchema.partial());
exports.inhabilitarNinoSchema = zod_1.z.object({
    fecha: zod_1.z.coerce.date(),
    motivo: zod_1.z.string().min(3)
});
exports.autoInhabilitarSchema = zod_1.z.object({
    dryRun: zod_1.z.boolean().optional().default(false),
    fechaReferencia: zod_1.z.coerce.date().optional()
});
