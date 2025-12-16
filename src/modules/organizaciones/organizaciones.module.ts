/**
 * # organizaciones.module
 * Propósito: Módulo de agregación organizaciones.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { OrganizacionesController } from './organizaciones.controller';

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { CreateOrganizacionConProvidenciaUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionConProvidenciaUseCase';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { PrismaOrganizacionRepository } from '@/infra/database/repositories/PrismaOrganizacionRepository';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [OrganizacionesController],
  providers: [
    ListOrganizacionesUseCase,
    CreateOrganizacionUseCase,
    CreateOrganizacionConProvidenciaUseCase,
    GetOrganizacionUseCase,
    UpdateOrganizacionUseCase,
    DeleteOrganizacionUseCase,
    PrismaOrganizacionRepository,
    { provide: OrganizacionRepository, useExisting: PrismaOrganizacionRepository }
  ],
  exports: [OrganizacionRepository]
})
export class OrganizacionesModule {}
