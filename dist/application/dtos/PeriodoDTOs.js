"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePeriodoSchema = exports.createPeriodoSchema = exports.periodoBaseSchema = void 0;
const zod_1 = require("zod");
exports.periodoBaseSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3),
    fecha_inicio: zod_1.z.coerce.date().optional().nullable(),
    fecha_fin: zod_1.z.coerce.date().optional().nullable(),
    estado_periodo: zod_1.z.enum(['borrador', 'planificado', 'abierto', 'cerrado']).default('borrador'),
    es_activo: zod_1.z.boolean().default(false),
    descripcion: zod_1.z.string().optional().nullable()
});
exports.createPeriodoSchema = exports.periodoBaseSchema;
exports.updatePeriodoSchema = exports.periodoBaseSchema.partial();
