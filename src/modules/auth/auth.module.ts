/**
 * # auth.module
 * Propósito: Módulo de agregación auth.module
 * Pertenece a: Módulo Nest
 * Interacciones: Providers, controllers
 */

import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { RolesController } from './roles.controller';

import { HashProvider, TokenProvider } from '@/application/contracts/Auth';
import { UserRepository } from '@/application/repositories/UserRepository';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import { PasetoService } from '@/infra/auth/PasetoService';
import { PrismaUserRepository } from '@/infra/database/repositories/PrismaUserRepository';
import { BcryptProvider } from '@/infra/security/BcryptProvider';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';
import { RoleAdminService } from '@/modules/auth/services/role-admin.service';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [LogsModule],
  controllers: [AuthController, RolesController],
  providers: [
    LoginUseCase,
    RefreshTokenUseCase,
    PasetoService,
    BcryptProvider,
    PrismaUserRepository,
    { provide: UserRepository, useExisting: PrismaUserRepository },
    { provide: TokenProvider, useExisting: PasetoService },
    { provide: HashProvider, useExisting: BcryptProvider },
    AuthorizationService,
    RoleAdminService
  ],
  exports: [PasetoService, AuthorizationService, RoleAdminService]
})
export class AuthModule {}
