/**
 * # periodos.module
 * Propósito: Módulo de agregación periodos.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { PeriodosController } from './periodos.controller';

import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';
import { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';
import { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
import { PrismaPeriodoRepository } from '@/infra/database/repositories/PrismaPeriodoRepository';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [PeriodosController],
  providers: [
    ListPeriodosUseCase,
    CreatePeriodoUseCase,
    UpdatePeriodoUseCase,
    OpenPeriodoUseCase,
    ClosePeriodoUseCase,
    ActivatePeriodoUseCase,
    PrismaPeriodoRepository,
    { provide: PeriodoRepository, useExisting: PrismaPeriodoRepository }
  ],
  exports: [PeriodoRepository]
})
export class PeriodosModule {}
