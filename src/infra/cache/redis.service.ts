/**
 * # redis.service
 * Propósito: Infra redis.service
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
/**
 * RedisService
 * Capa: Infraestructura / Cache
 * Responsabilidad: Proveer acceso seguro a Redis (get/set/del/incr) con manejo de errores y fallback en dev/test.
 * Reglas: En producción requiere Redis configurado (lanzará error si falta).
 * Dependencias: ioredis, env (REDIS_URL/REDIS_HOST, NODE_ENV).
 * Usos: rate limiting, cache de permisos, refresh token store, export jobs.
 */
import { env } from '@/config/env';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClient | null;

  constructor() {
    const redisConfigured = Boolean(env.REDIS_URL || env.REDIS_HOST);

    if (env.NODE_ENV === 'production' && !redisConfigured) {
      throw new Error('Redis is required in production for rate limiting and token security');
    }

    if (redisConfigured) {
      this.client = env.REDIS_URL
        ? new Redis(env.REDIS_URL)
        : new Redis({
            host: env.REDIS_HOST,
            port: env.REDIS_PORT ?? 6379,
            password: env.REDIS_PASSWORD || undefined
          });

      this.client.on('error', (error) => {
        this.logger.warn(`Redis error: ${(error as Error).message}`);
      });
    } else {
      this.client = null;
      this.logger.log('Redis no configurado; se continuará sin cache distribuido.');
    }
  }

  get isEnabled() {
    return Boolean(this.client);
  }

  async get(key: string) {
    if (!this.client) {
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.warn(`Redis get falló para ${key}: ${(error as Error).message}`);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (!this.client) {
      return;
    }
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.warn(`Redis set falló para ${key}: ${(error as Error).message}`);
    }
  }

  async del(key: string) {
    if (!this.client) {
      return;
    }
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.warn(`Redis del falló para ${key}: ${(error as Error).message}`);
    }
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    if (!this.client) {
      return this.fallbackIncr(key, ttlSeconds);
    }
    try {
      const value = await this.client.incr(key);
      if (value === 1) {
        await this.client.expire(key, ttlSeconds);
      }
      return value;
    } catch (error) {
      this.logger.warn(`Redis incr falló para ${key}: ${(error as Error).message}`);
      return this.fallbackIncr(key, ttlSeconds);
    }
  }

  // Fallback in-memory counter when Redis is disabled or falla.
  private fallbackCounters = new Map<string, { expiresAt: number; count: number }>();

  private fallbackIncr(key: string, ttlSeconds: number): number {
    const now = Date.now();
    const existing = this.fallbackCounters.get(key);
    if (!existing || existing.expiresAt < now) {
      const entry = { count: 1, expiresAt: now + ttlSeconds * 1000 };
      this.fallbackCounters.set(key, entry);
      return 1;
    }
    existing.count += 1;
    return existing.count;
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }
}
