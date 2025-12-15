"use strict";
/**
 * # Auth DTOs
 * Propósito: DTOs para Auth DTOs
 * Pertenece a: Aplicación / DTOs
 * Interacciones: Validación y transporte de datos
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshRequestSchema = exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1)
});
exports.refreshRequestSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1).optional()
});
