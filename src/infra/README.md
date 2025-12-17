<!-- # README | Propósito: Infra README | Pertenece a: Infraestructura | Interacciones: Servicios externos / adaptadores -->

# Carpeta infra/

Propósito: implementar adaptadores concretos hacia tecnologías externas (Prisma, cache, HTTP, auth, jobs, security).

Subcarpetas comunes:
- `database/`: Prisma y configuración de pool/timeouts (usa env `DB_*`).
- `cache/`: Redis para sesiones, rate limit y jobs de export.
- `auth/`: PASETO service y guards; generan/verifican tokens y seteo de cookies (vía controllers).
- `reporting/`: generación de PDF/Excel y manejo de exportes en cola.
- `jobs/`: tareas programadas.
- `security/`: utilidades de seguridad.

Relaciones:
- Implementa los contratos definidos en `application/repositories` y es inyectado en `modules/`.
- Usa configuración desde `config/` y utilidades de `shared/`.

Notas para frontend (contexto):
- Cookies y headers se manejan en controllers, pero la emisión/validación de tokens y sesiones ocurre en `infra/auth` y `infra/cache` (Redis). Útil para entender expiraciones y nombres de cookies.
