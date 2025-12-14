/**
 * # setup
 * Propósito: Prueba unitaria setup
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import 'dotenv/config';
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { beforeAll, afterAll } from 'vitest';

import { PrismaService } from '@/infra/database/prisma/prisma.service';

const noop = () => undefined;
Logger.overrideLogger(['log', 'warn', 'debug', 'verbose']);
Logger.prototype.error = noop;
Logger.error = noop as typeof Logger.error;

process.env.NODE_ENV ??= 'test';

process.env.PASETO_SECRET ??= 't'.repeat(64);

process.env.DB_HOST ??= 'localhost';
process.env.DB_PORT ??= '1433';
process.env.DB_USER ??= 'sa';
process.env.DB_PASSWORD ??= 'VeryStrongPwd123!';
process.env.DB_NAME ??= 'test';
process.env.DEFAULT_ADMIN_EMAIL ??= 'admin@example.com';
process.env.DEFAULT_ADMIN_PASSWORD ??= 'ChangeMe123!';

let dbReady = false;
let prisma: PrismaService | null = null;

beforeAll(async () => {
  if (process.env.RUN_DB_TESTS === 'true') {
    try {
      prisma = new PrismaService();
      await prisma.$connect();
      dbReady = true;
    } catch (error) {
      dbReady = false;
      console.warn('[tests/setup] RUN_DB_TESTS=true pero la base de datos no respondió, se omite la conexión:', error);
    }
  }
});

afterAll(async () => {
  if (dbReady && prisma) {
    await prisma.$disconnect();
  }
});
