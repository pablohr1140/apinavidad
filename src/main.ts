/**
 * # main
 * Propósito: Archivo main
 * Pertenece a: General
 * Interacciones: N/A
 */

/**
 * # main.ts
 *
 * Entrada de arranque de la aplicación NestJS.
 * Responsibilities: bootstrap de la app HTTP, habilitar CORS, cookies y seguridad básica.
 * Interactions: crea la instancia de `AppModule`, lee `env` para puerto y orígenes, aplica middlewares globales.
 * Depende de: `@nestjs/core`, `helmet`, `cookie-parser`, configuración en `env` y alias en `config/module-alias`.
 * Pertenece a: Capa de infraestructura/bootstrap (orquestación de inicio).
 */
import './config/module-alias';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { env } from './config/env';

/**
 * Inicializa la aplicación NestJS.
 * Crea el `AppModule`, configura CORS con orígenes permitidos desde `env`, habilita cookies y cabeceras de seguridad,
 * y levanta el servidor HTTP en el puerto configurado.
 */
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = env.WEB_APP_ORIGIN ? env.WEB_APP_ORIGIN.split(',').map((value) => value.trim()) : true;
  app.enableCors({
    origin: allowedOrigins,
    credentials: true
  });
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(env.PORT);
}

if (require.main === module) {
  bootstrap();
}
