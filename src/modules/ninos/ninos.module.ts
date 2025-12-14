/**
 * # ninos.module
 * Propósito: Módulo de agregación ninos.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { NinosController } from './ninos.controller';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
import { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
import { PrismaNinoRepository } from '@/infra/database/repositories/PrismaNinoRepository';
import { LogsModule } from '@/modules/logs/logs.module';
import { PeriodosModule } from '@/modules/periodos/periodos.module';

@Module({
  imports: [LogsModule, PeriodosModule],
  controllers: [NinosController],
  providers: [
    ListNinosUseCase,
    CreateNinoUseCase,
    GetNinoUseCase,
    UpdateNinoUseCase,
    InhabilitarNinoUseCase,
    RestaurarNinoUseCase,
    AutoInhabilitarNinosUseCase,
    PrismaNinoRepository,
    { provide: NinoRepository, useExisting: PrismaNinoRepository }
  ],
  exports: [ListNinosUseCase, AutoInhabilitarNinosUseCase]
})
export class NinosModule {}
