/**
 * # Bcrypt Provider
 * Propósito: Infra Bcrypt Provider
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */
import { HashProvider } from '@/application/contracts/Auth';
export declare class BcryptProvider implements HashProvider {
    hash(plain: string): Promise<string>;
    compare(plain: string, hash: string): Promise<boolean>;
}
