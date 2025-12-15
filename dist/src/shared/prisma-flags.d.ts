/**
 * # prisma flags
 * Propósito: Utilidades compartidas prisma flags
 * Pertenece a: Compartido
 * Interacciones: Helpers reutilizables
 */
export interface PrismaFlagState {
    readsEnabled: true;
    writesEnabled: true;
    summary: string;
}
export declare const getPrismaFlagState: () => PrismaFlagState;
