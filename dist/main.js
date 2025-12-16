"use strict";
/**
 * # main
 * Propósito: Archivo main
 * Pertenece a: General
 * Interacciones: N/A
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
/**
 * # main.ts
 *
 * Entrada de arranque de la aplicación NestJS.
 * Responsibilities: bootstrap de la app HTTP, habilitar CORS, cookies y seguridad básica.
 * Interactions: crea la instancia de `AppModule`, lee `env` para puerto y orígenes, aplica middlewares globales.
 * Depende de: `@nestjs/core`, `helmet`, `cookie-parser`, configuración en `env` y alias en `config/module-alias`.
 * Pertenece a: Capa de infraestructura/bootstrap (orquestación de inicio).
 */
require("./config/module-alias");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const env_1 = require("./config/env");
/**
 * Inicializa la aplicación NestJS.
 * Crea el `AppModule`, configura CORS con orígenes permitidos desde `env`, habilita cookies y cabeceras de seguridad,
 * y levanta el servidor HTTP en el puerto configurado.
 */
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = env_1.env.WEB_APP_ORIGIN ? env_1.env.WEB_APP_ORIGIN.split(',').map((value) => value.trim()) : true;
    app.enableCors({
        origin: allowedOrigins,
        credentials: true
    });
    app.use((0, cookie_parser_1.default)());
    app.use((0, helmet_1.default)());
    await app.listen(env_1.env.PORT);
}
if (require.main === module) {
    bootstrap();
}
