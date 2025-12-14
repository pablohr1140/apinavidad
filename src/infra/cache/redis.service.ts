/**
 * # redis.service
 * Propósito: Infra redis.service
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { Redis as RedisClient } from 'ioredis';
import Redis from 'ioredis';

import { env } from '@/config/env';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClient | null;

  constructor() {
    if (env.REDIS_URL || env.REDIS_HOST) {
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

  async onModuleDestroy() {
    await this.client?.quit();
  }
}
