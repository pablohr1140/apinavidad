/**
 * # Paseto Service
 * Propósito: Servicio/Auth Paseto Service
 * Pertenece a: Infraestructura / Auth
 * Interacciones: Tokens, servicios de auth
 */

import { createHash } from 'crypto';

import { Injectable } from '@nestjs/common';
import { V3 } from 'paseto';

import { TokenPayload, TokenProvider } from '@/application/contracts/Auth';
import { env } from '@/config/env';

const secretKey = createHash('sha256').update(env.PASETO_SECRET).digest();

@Injectable()
export class PasetoService implements TokenProvider {
  async sign(payload: TokenPayload, options?: { expiresInMinutes?: number }) {
    const exp = new Date(Date.now() + (options?.expiresInMinutes ?? 30) * 60 * 1000);
    return V3.encrypt({ ...payload, exp }, secretKey);
  }

  async verify(token: string) {
    const { exp, ...payload } = await V3.decrypt<TokenPayload & { exp: string | Date }>(token, secretKey);
    if (new Date(exp) < new Date()) {
      throw new Error('Token expirado');
    }
    return payload;
  }
}
