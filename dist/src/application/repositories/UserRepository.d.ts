/**
 * # User Repository
 * Propósito: Contrato de repositorio User Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */
/**
 * # UserRepository
 *
 * Propósito: contrato de acceso a usuarios para autenticación y autorización.
 * Pertenece a: Application layer.
 * Interacciones: entidades `RoleSummary`; usado por casos de uso de auth.
 */
import type { RoleSummary } from '@/domain/entities';
export interface UserRecord {
    id: number;
    email: string;
    passwordHash: string;
    roles: RoleSummary[];
    createdAt: Date;
    updatedAt: Date;
}
export declare abstract class UserRepository {
    /** Busca usuario por email, retorna null si no existe. */
    abstract findByEmail(email: string): Promise<UserRecord | null>;
}
