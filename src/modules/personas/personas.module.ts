/**
 * # personas.module
 * Propósito: Módulo de agregación personas.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { PersonasController } from './personas.controller';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';
import { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';
import { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
import { PrismaPersonaRepository } from '@/infra/database/repositories/PrismaPersonaRepository';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [PersonasController],
  providers: [
    ListPersonasUseCase,
    CreatePersonaUseCase,
    GetPersonaUseCase,
    UpdatePersonaUseCase,
    DeletePersonaUseCase,
    PrismaPersonaRepository,
    { provide: PersonaRepository, useExisting: PrismaPersonaRepository }
  ],
  exports: [PersonaRepository]
})
export class PersonasModule {}
