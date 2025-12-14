/**
 * # Redis Service.spec
 * Propósito: Prueba unitaria Redis Service.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { Logger } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { env } from '@/config/env';
import { RedisService } from '@/infra/cache/redis.service';

type RedisClientMock = {
  on: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
  quit: ReturnType<typeof vi.fn>;
};

const { redisCtor, redisInstances } = vi.hoisted(() => {
  const instances: RedisClientMock[] = [];
  const ctor = vi.fn(function RedisMock() {
    const instance: RedisClientMock = {
      on: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      quit: vi.fn()
    };
    instances.push(instance);
    return instance;
  });

  return { redisCtor: ctor, redisInstances: instances };
});

vi.mock('ioredis', () => ({
  __esModule: true,
  default: redisCtor
}));

describe('RedisService', () => {
  const originalEnv = { ...env };
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    Object.assign(env, originalEnv);
    redisInstances.length = 0;
    redisCtor.mockClear();
    warnSpy = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    logSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('disables redis when no connection info is provided', async () => {
    env.REDIS_URL = undefined;
    env.REDIS_HOST = undefined;

    const service = new RedisService();

    expect(service.isEnabled).toBe(false);
    expect(redisCtor).not.toHaveBeenCalled();
    await expect(service.get('missing')).resolves.toBeNull();
    expect(logSpy).toHaveBeenCalledWith('Redis no configurado; se continuará sin cache distribuido.');
  });

  it('uses REDIS_URL for connections and handles ttl operations', async () => {
    env.REDIS_URL = 'redis://localhost:6379';

    const service = new RedisService();
    const client = redisInstances.at(-1)!;

    expect(redisCtor).toHaveBeenCalledWith('redis://localhost:6379');
    expect(client.on).toHaveBeenCalledWith('error', expect.any(Function));

    client.get.mockResolvedValueOnce('value');
    await expect(service.get('key')).resolves.toBe('value');

    client.get.mockRejectedValueOnce(new Error('boom'));
    await expect(service.get('key')).resolves.toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Redis get falló'));

    await service.set('cache', 'payload', 30);
    expect(client.set).toHaveBeenCalledWith('cache', 'payload', 'EX', 30);

    client.set.mockResolvedValueOnce(undefined);
    await service.set('cache', 'payload');
    expect(client.set).toHaveBeenCalledWith('cache', 'payload');

    client.set.mockRejectedValueOnce(new Error('boom'));
    await service.set('cache', 'payload');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Redis set falló'));
  });

  it('handles delete failures and closes the connection on destroy', async () => {
    env.REDIS_HOST = 'localhost';
    env.REDIS_PORT = 6380;
    env.REDIS_PASSWORD = 'secret';

    const service = new RedisService();
    const client = redisInstances.at(-1)!;

    client.del.mockRejectedValueOnce(new Error('boom'));
    await service.del('key');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Redis del falló'));

    client.del.mockResolvedValueOnce(undefined);
    await service.del('key');
    expect(client.del).toHaveBeenCalledWith('key');

    client.quit.mockResolvedValueOnce(undefined);
    await service.onModuleDestroy();
    expect(client.quit).toHaveBeenCalled();
  });
});
