/**
 * # app.module
 * Propósito: Archivo app.module
 * Pertenece a: General
 * Interacciones: N/A
 */

/**
 * # app.module.ts
 *
 * Módulo raíz de NestJS: orquesta módulos de infraestructura y dominio (DB, caché, auth, features).
 * Responsibilities: carga `ConfigModule` global, registra módulos de dominio y aplica guards globales (Paseto + Permissions).
 * Interactions: depende de `DatabaseModule`, `CacheModule`, módulos de negocio y guards de auth.
 * Pertenece a: capa de infraestructura/orquestación Nest.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { CacheModule } from '@/infra/cache/cache.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PasetoAuthGuard } from '@/modules/auth/guards/paseto-auth.guard';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';
import { LogsModule } from '@/modules/logs/logs.module';
import { NinosModule } from '@/modules/ninos/ninos.module';
import { OrganizacionesModule } from '@/modules/organizaciones/organizaciones.module';
import { PeriodosModule } from '@/modules/periodos/periodos.module';
import { PersonasModule } from '@/modules/personas/personas.module';
import { ReportesModule } from '@/modules/reportes/reportes.module';
import { HealthController } from '@/modules/shared/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CacheModule,
    AuthModule,
    PersonasModule,
    OrganizacionesModule,
    PeriodosModule,
    NinosModule,
    ReportesModule,
    LogsModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PasetoAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    }
  ]
})
/**
 * Módulo principal que agrupa configuración global y aplica guardias de autenticación y permisos a todas las rutas.
 */
export class AppModule {}
