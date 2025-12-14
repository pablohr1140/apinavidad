/**
 * # database.module
 * Propósito: Infra DB database.module
 * Pertenece a: Infraestructura / Base de datos
 * Interacciones: Prisma, conexión a BD
 */

import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class DatabaseModule {}
