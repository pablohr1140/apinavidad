/**
 * # health.controller
 * Propósito: Endpoints HTTP de health.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # HealthController
 *
 * Propósito: endpoint público de liveness/healthcheck.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: decorador `Public` para omitir guard de auth.
 */
import { Controller, Get } from '@nestjs/common';

import { Public } from '@/modules/auth/decorators/public.decorator';

@Controller()
export class HealthController {
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
