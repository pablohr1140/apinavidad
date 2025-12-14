/**
 * # auto Inhabilitar Job
 * Propósito: Infra auto Inhabilitar Job
 * Pertenece a: Infraestructura
 * Interacciones: Servicios externos / adaptadores
 */

import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { logger } from '@/shared/logger';

export async function runAutoInhabilitarJob() {
  const context = await NestFactory.createApplicationContext(AppModule);

  try {
    const useCase = context.get(AutoInhabilitarNinosUseCase);
    const result = await useCase.execute({});
    logger.info({ afectados: result.afectados }, 'Auto inhabilitacion ejecutada');
  } finally {
    await context.close();
  }
}

if (process.env.NODE_ENV !== 'test') {
  runAutoInhabilitarJob().catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}
