/**
 * # reportes.module
 * Propósito: Módulo de agregación reportes.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { ReportesController } from './reportes.controller';
import { ReportExportService } from './report-export.service';

import { ReportingService } from '@/infra/reporting/reporting.service';
import { NinosModule } from '@/modules/ninos/ninos.module';

@Module({
  imports: [NinosModule],
  controllers: [ReportesController],
  providers: [ReportingService, ReportExportService]
})
export class ReportesModule {}
