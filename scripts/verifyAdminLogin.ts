/**
 * # verify Admin Login
 * Propósito: Script verify Admin Login
 * Pertenece a: Script utilitario
 * Interacciones: CLI/automatización
 */

import { NestFactory } from '@nestjs/core';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { AppModule } from '@/app.module';
import { env } from '@/config/env';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  try {
    const loginUseCase = app.get(LoginUseCase);
    const result = await loginUseCase.execute({
      email: env.DEFAULT_ADMIN_EMAIL,
      password: env.DEFAULT_ADMIN_PASSWORD
    });

    console.log('[login-check] Success:', {
      user: result.user,
      accessTokenPreview: result.accessToken.slice(0, 12)
    });
  } catch (error) {
    console.error('[login-check] Failed:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

main();
