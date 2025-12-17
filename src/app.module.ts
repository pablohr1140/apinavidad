/**
 * app.module.ts
 * Capa: Orquestación Nest
 * Responsabilidad: Ensamblar módulos de infraestructura y dominio, cargar configuración global y aplicar guards globales.
 * Interacciones: `ConfigModule` global para leer `env`; módulos de DB/Cache/Auth/negocio; registra APP_GUARD en orden (Paseto luego Permissions) para exigir sesión antes de evaluar permisos.
 * Notas: Cambiar este orden afecta seguridad; `HealthController` también queda bajo guards globales a menos que se excluya con metadata.
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
import { env } from '@/config/env';

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
