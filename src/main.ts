/**
 * # main
 * Propósito: Archivo main
 * Pertenece a: General
 * Interacciones: N/A
 */

/**
 * main.ts
 * Capa: Bootstrap / Infraestructura
 * Responsabilidad: Inicializar NestJS, configurar CORS, cookies, helmet, CSRF, ValidationPipe global, logging y filtros de errores.
 * Dependencias: AppModule, env (WEB_APP_ORIGIN, PORT), middlewares compartidos (requestId, csrf), interceptores/filtros globales.
 * Impacto en frontend: define orígenes permitidos y habilita cookies con credenciales; entrega header y cookie CSRF.
 */
import './config/module-alias';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { env } from './config/env';
import { requestIdMiddleware } from './modules/shared/middleware/request-id.middleware';
import { csrfProtection, attachCsrfToken } from './modules/shared/middleware/csrf.middleware';
import { RequestLoggingInterceptor } from './modules/shared/interceptors/request-logging.interceptor';
import { AllExceptionsFilter } from './modules/shared/filters/all-exceptions.filter';

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
  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.use(helmet());
  app.use(csrfProtection);
  app.use(attachCsrfToken);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  app.useGlobalInterceptors(new RequestLoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(env.PORT);
}

if (require.main === module) {
  bootstrap();
}
