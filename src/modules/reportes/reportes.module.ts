/**
 * # reportes.module
 * Propósito: Módulo de agregación reportes.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { ReportesController } from './reportes.controller';

import { ReportingService } from '@/infra/reporting/reporting.service';
import { NinosModule } from '@/modules/ninos/ninos.module';

@Module({
  imports: [NinosModule],
  controllers: [ReportesController],
  providers: [ReportingService]
})
export class ReportesModule {}
