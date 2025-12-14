<!-- # README | Propósito: Infra README | Pertenece a: Infraestructura | Interacciones: Servicios externos / adaptadores -->

# Carpeta infra/

Propósito: implementar adaptadores concretos hacia tecnologías externas (Prisma, cache, HTTP, auth, jobs, security).

Subcarpetas comunes:
- `database/`: módulos y repositorios Prisma.
- `cache/`: integración con Redis u otros caches.
- `http/`: clientes o adaptadores HTTP.
- `jobs/`: tareas programadas y orquestación.
- `auth/`: servicios/guards de autenticación.
- `security/`: utilidades de seguridad.

Relaciones:
- Implementa los contratos definidos en `application/repositories` y es inyectado en `modules/`.
- Usa configuración desde `config/` y utilidades de `shared/`.
