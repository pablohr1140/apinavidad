"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePersonaSchema = exports.createPersonaSchema = exports.personaBaseSchema = void 0;
const zod_1 = require("zod");
const access_control_1 = require("../../domain/access-control");
const RoleKeyEnum = zod_1.z.enum([...access_control_1.ROLE_KEYS]);
exports.personaBaseSchema = zod_1.z.object({
    nombres: zod_1.z.string().min(2),
    apellidos: zod_1.z.string().min(2),
    run: zod_1.z.string().min(5).optional().nullable(),
    dv: zod_1.z.string().min(1).max(2).optional().nullable(),
    documento: zod_1.z.string().max(32).optional().nullable(),
    fecha_nacimiento: zod_1.z.coerce.date().optional().nullable(),
    sexo: zod_1.z.enum(['M', 'F', 'X']).optional().nullable(),
    telefono: zod_1.z.string().optional().nullable(),
    email: zod_1.z.string().email().optional().nullable(),
    email_verified_at: zod_1.z.coerce.date().optional().nullable(),
    password: zod_1.z.string().min(8).optional().nullable(),
    rememberToken: zod_1.z.string().optional().nullable(),
    direccion: zod_1.z.string().optional().nullable(),
    providenciaId: zod_1.z.number().int().optional().nullable(),
    esRepresentante: zod_1.z.boolean().optional().default(false),
    roles: zod_1.z.array(RoleKeyEnum).optional()
});
exports.createPersonaSchema = exports.personaBaseSchema;
exports.updatePersonaSchema = exports.personaBaseSchema.partial();
