"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
/**
 * # app.module.ts
 *
 * Módulo raíz de NestJS: orquesta módulos de infraestructura y dominio (DB, caché, auth, features).
 * Responsibilities: carga `ConfigModule` global, registra módulos de dominio y aplica guards globales (Paseto + Permissions).
 * Interactions: depende de `DatabaseModule`, `CacheModule`, módulos de negocio y guards de auth.
 * Pertenece a: capa de infraestructura/orquestación Nest.
 */
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./infra/database/database.module");
const cache_module_1 = require("./infra/cache/cache.module");
const auth_module_1 = require("./modules/auth/auth.module");
const personas_module_1 = require("./modules/personas/personas.module");
const organizaciones_module_1 = require("./modules/organizaciones/organizaciones.module");
const periodos_module_1 = require("./modules/periodos/periodos.module");
const ninos_module_1 = require("./modules/ninos/ninos.module");
const reportes_module_1 = require("./modules/reportes/reportes.module");
const logs_module_1 = require("./modules/logs/logs.module");
const paseto_auth_guard_1 = require("./modules/auth/guards/paseto-auth.guard");
const health_controller_1 = require("./modules/shared/health.controller");
const permissions_guard_1 = require("./modules/auth/guards/permissions.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            auth_module_1.AuthModule,
            personas_module_1.PersonasModule,
            organizaciones_module_1.OrganizacionesModule,
            periodos_module_1.PeriodosModule,
            ninos_module_1.NinosModule,
            reportes_module_1.ReportesModule,
            logs_module_1.LogsModule
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: paseto_auth_guard_1.PasetoAuthGuard
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard
            }
        ]
    })
    /**
     * Módulo principal que agrupa configuración global y aplica guardias de autenticación y permisos a todas las rutas.
     */
], AppModule);
