"use strict";
/**
 * # prisma flags
 * Propósito: Utilidades compartidas prisma flags
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaFlagState = void 0;
const getPrismaFlagState = () => {
    const summary = 'PRISMA_ONLY';
    return { readsEnabled: true, writesEnabled: true, summary };
};
exports.getPrismaFlagState = getPrismaFlagState;
