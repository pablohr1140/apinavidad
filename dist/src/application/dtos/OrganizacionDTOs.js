"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrganizacionSchema = exports.createOrganizacionSchema = exports.organizacionBaseSchema = void 0;
const zod_1 = require("zod");
exports.organizacionBaseSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3),
    sigla: zod_1.z.string().max(50).optional().nullable(),
    rut: zod_1.z.string().min(5).max(12).optional().nullable(),
    tipo: zod_1.z.string().min(2).default('otro'),
    direccion: zod_1.z.string().optional().nullable(),
    telefono: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    providenciaId: zod_1.z.number().int().optional().nullable(),
    estado: zod_1.z.enum(['borrador', 'activo', 'suspendido']).default('borrador')
});
exports.createOrganizacionSchema = exports.organizacionBaseSchema;
exports.updateOrganizacionSchema = exports.organizacionBaseSchema.partial();
