/**
 * RefreshTokenStore
 * Capa: Infra/Service (inyectado en módulo auth)
 * Responsabilidad: Persistir metadatos de sesión de refresh (sessionId, tokenVersion) en Redis para rotación y detección de reuso.
 * Dependencias: RedisService, env (para TTL via REFRESH_TOKEN_TTL_MINUTES).
 * Flujo: buildNewSession -> persistSession; en refresh: isCurrent/rotate; revoke borra clave; TTL = vida del refresh.
 * Endpoints impactados: /auth/login (crea sesión), /auth/refresh (valida/rota), guard/flows de auth.
 * Frontend: no interactúa directo; soporta rotación de refresh tokens usados en cookies.
 */
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { REFRESH_TOKEN_TTL_MINUTES } from '@/config/auth';
import { RedisService } from '@/infra/cache/redis.service';

const SESSION_PREFIX = 'refresh-session:';
const TTL_SECONDS = REFRESH_TOKEN_TTL_MINUTES * 60;

interface SessionMeta {
  version: number;
  expiresAt: number;
}

@Injectable()
export class RefreshTokenStore {
  private readonly fallback = new Map<string, SessionMeta>();

  constructor(private readonly redis: RedisService) {}

  buildNewSession() {
    return { sessionId: randomUUID(), tokenVersion: 1 } as const;
  }

  async persistSession(userId: string, sessionId: string, version: number) {
    const key = this.buildKey(userId, sessionId);
    if (this.redis.isEnabled) {
      await this.redis.set(key, version.toString(), TTL_SECONDS);
      return;
    }
    this.fallbackSet(key, version);
  }

  async isCurrent(userId: string, sessionId: string, version: number) {
    const current = await this.getVersion(userId, sessionId);
    return current === version;
  }

  async rotate(userId: string, sessionId: string, nextVersion: number) {
    await this.persistSession(userId, sessionId, nextVersion);
  }

  async revoke(userId: string, sessionId: string) {
    const key = this.buildKey(userId, sessionId);
    if (this.redis.isEnabled) {
      await this.redis.del(key);
    }
    this.fallback.delete(key);
  }

  private async getVersion(userId: string, sessionId: string): Promise<number | null> {
    const key = this.buildKey(userId, sessionId);
    if (this.redis.isEnabled) {
      const value = await this.redis.get(key);
      return value ? Number(value) : null;
    }
    const meta = this.fallbackGet(key);
    return meta ? meta.version : null;
  }

  private buildKey(userId: string, sessionId: string) {
    return `${SESSION_PREFIX}${userId}:${sessionId}`;
  }

  private fallbackSet(key: string, version: number) {
    this.fallback.set(key, { version, expiresAt: Date.now() + TTL_SECONDS * 1000 });
  }

  private fallbackGet(key: string): SessionMeta | null {
    const meta = this.fallback.get(key);
    if (!meta) return null;
    if (meta.expiresAt < Date.now()) {
      this.fallback.delete(key);
      return null;
    }
    return meta;
  }
}
