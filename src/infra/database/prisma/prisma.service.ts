/**
 * # prisma.service
 * Propósito: Infra DB prisma.service
 * Pertenece a: Infraestructura / Base de datos
 * Interacciones: Prisma, conexión a BD
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { env } from '@/config/env';

const DEFAULT_LOG_LEVELS: Array<'error' | 'warn'> = ['error'];
if (env.NODE_ENV === 'development') {
  DEFAULT_LOG_LEVELS.push('warn');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private static readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = PrismaService.resolveConnectionString();

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0) {
      process.env.DATABASE_URL = connectionString;
    }

    super({
      log: DEFAULT_LOG_LEVELS
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static resolveConnectionString() {
    if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
      return env.DATABASE_URL;
    }

    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;
    const encodedUser = encodeURIComponent(DB_USER);
    const encodedPassword = encodeURIComponent(DB_PASSWORD);

    const url = `sqlserver://${DB_HOST}:${DB_PORT};database=${DB_NAME};user=${encodedUser};password=${encodedPassword};encrypt=false;trustServerCertificate=true`;
    PrismaService.logger.verbose?.(`Usando connection string derivada para Prisma (${DB_HOST}:${DB_PORT}/${DB_NAME})`);
    return url;
  }
}
