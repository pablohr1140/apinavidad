"use strict";
/**
 * # Organizacion DTOs
 * Propósito: DTOs para Organizacion DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizacionConProvidenciaSchema = exports.updateOrganizacionSchema = exports.createOrganizacionSchema = exports.organizacionBaseSchema = void 0;
const zod_1 = require("zod");
const organizacionShape = zod_1.z.object({
    nombre: zod_1.z.string().min(3),
    tipo: zod_1.z.string().min(2).default('otro'),
    direccion: zod_1.z.string().optional().nullable(),
    telefono: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    providenciaId: zod_1.z.number().int().optional().nullable(),
    sectorId: zod_1.z.number().int().optional().nullable(),
    estado: zod_1.z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
});
exports.organizacionBaseSchema = organizacionShape.superRefine((data, ctx) => {
    if (data.tipo?.toLowerCase() === 'providencia' && (data.providenciaId === null || data.providenciaId === undefined)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'El campo providenciaId es obligatorio cuando tipo=Providencia',
            path: ['providenciaId']
        });
    }
});
exports.createOrganizacionSchema = exports.organizacionBaseSchema;
exports.updateOrganizacionSchema = organizacionShape.partial().superRefine((data, ctx) => {
    if (data.tipo?.toLowerCase() === 'providencia' && (data.providenciaId === null || data.providenciaId === undefined)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'El campo providenciaId es obligatorio cuando tipo=Providencia',
            path: ['providenciaId']
        });
    }
});
exports.createOrganizacionConProvidenciaSchema = zod_1.z.object({
    providencia: zod_1.z.object({
        nombre: zod_1.z.string().trim().min(3),
        codigo: zod_1.z.string().trim().min(1).max(10)
    }),
    organizacion: zod_1.z.object({
        nombre: zod_1.z.string().trim().min(3),
        tipo: zod_1.z.literal('Providencia'),
        direccion: zod_1.z.string().optional().nullable(),
        telefono: zod_1.z.string().optional().nullable(),
        email: zod_1.z.string().email().optional().nullable(),
        sectorId: zod_1.z.number().int().optional().nullable(),
        estado: zod_1.z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
    })
});
