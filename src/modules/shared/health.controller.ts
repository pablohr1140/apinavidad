/**
 * HealthController
 * Capa: HTTP / Observabilidad
 * Responsabilidad: Exponer `/health` como endpoint de liveness sin requerir autenticación.
 * Interacciones: usa el decorador `@Public` para saltar los guards globales (Paseto + Permissions).
 * Notas: diseñado para probes de load balancer/monitoring; no incluir lógica de negocio aquí.
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
