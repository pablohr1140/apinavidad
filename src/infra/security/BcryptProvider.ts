/**
 * # Bcrypt Provider
 * Propósito: Infra Bcrypt Provider
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */

import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { HashProvider } from '@/application/contracts/Auth';

@Injectable()
export class BcryptProvider implements HashProvider {
  hash(plain: string) {
    return hash(plain, 10);
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash);
  }
}
