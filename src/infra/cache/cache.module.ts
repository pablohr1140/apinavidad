/**
 * # cache.module
 * Propósito: Infra cache.module
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */

import { Global, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService]
})
export class CacheModule {}
