/**
 * # logs.module
 * Propósito: Módulo de agregación logs.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { LogRepository } from '@/application/repositories/LogRepository';
import { LogActivityUseCase } from '@/application/use-cases/logs/LogActivityUseCase';
import { PrismaLogRepository } from '@/infra/database/repositories/PrismaLogRepository';

@Module({
  providers: [LogActivityUseCase, PrismaLogRepository, { provide: LogRepository, useExisting: PrismaLogRepository }],
  exports: [LogActivityUseCase]
})
export class LogsModule {}
