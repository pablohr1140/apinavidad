<!-- # architecture | Propósito: Documento architecture | Pertenece a: Documentación | Interacciones: Texto de referencia -->

<!--
# architecture.md

Propósito: describir la arquitectura de alto nivel (capas, patrones y testing) del backend NestJS.
Responsabilidades: aclarar límites de dominio/application/infra/interfaces, prácticas de DTO/validación, autorización, jobs y observabilidad.
Interacciones: referencia a repositorios Prisma, guards de auth, jobs y suites de prueba.
Depende de: código fuente en `src/`, configuración en `config/`, y planes en los demás docs de Prisma.
Pertenece a: documentación técnica/arquitectura.
-->

# Arquitectura general

## Capas

- **Domain**: Entidades, enums y lógica inmutable del dominio (edad, inhabilitaciones, validaciones específicas).
- **Application**: Casos de uso (services) y contratos de repositorios. Orquestan validaciones Zod, invocan entidades y publican eventos simples.
- **Infrastructure**: Adaptadores concretos (Prisma, Nest HTTP, Paseto, jobs, logging). Mantiene dependencias externas fuera del dominio.
- **Interfaces (HTTP)**: Controladores y rutas Express, esquemas de request/response y middlewares.

## Patrones clave

- **DTOs + Zod**: Cada endpoint valida entrada/salida.
- **Repositorios**: Interfaces en `application/repositories`. Implementaciones Prisma en `infra/database`.
- **Servicios de dominio**: Reglas (edad máxima, auto-inhabilitación) en `domain/services` reutilizables dentro de casos de uso y jobs.
- **Auditoría**: Caso de uso dedicado `LogActivityUseCase` simplifica registro.
- **Autenticación**: Servicio `PasetoService` emite/verifica tokens v3 local y los expone en cookies HttpOnly administradas por `buildCookieOptions`; `PasetoAuthGuard` cubre rutas protegidas leyendo cabeceras o cookies.
- **Jobs**: `infra/jobs/autoInhabilitarJob.ts` reutiliza caso de uso `AutoInhabilitarNinosUseCase`.
- **Autorización**: Decoradores `@Permissions()` + guardias verifican permisos horizontales (`modulo.accion`). Las asignaciones viven en `roles`, `permissions`, `role_permissions` y `persona_roles`, mientras Redis cachea los permisos agregados por rol para no recalcularlos en cada request.

## Testing

- **Unit tests**: Casos de uso y servicios de dominio (Vitest).
- **E2E smoke**: Supertest sobre la app Nest levantada en memoria. Cuando se requiere persistencia real se aplican migraciones/seeds Prisma antes de la suite.

## Documentación y calidad

- **OpenAPI**: Archivo `openapi.yaml` + Swagger UI montado en `/docs`.
- **Scripts npm**: `npm run migration:run`, `npm run migration:revert`, `npm run seed`, `npm run test`, `npm run lint`, `npm run auto-inhabilitar`.
- **12-factor**: Config en `src/config/env.ts`, variables en `.env`.

## Prisma

- Prisma es el único stack de persistencia. La cadena se obtiene desde `DATABASE_URL` o se construye desde las variables `DB_HOST/PORT/USER/PASSWORD/NAME` en `PrismaService`.
- `tests/e2e/prisma-read.spec.ts` y `tests/e2e/prisma-write.spec.ts` validan que los controladores usen Prisma, incluidos pivotes como `persona_roles` y flujos `PUT/DELETE`.
- `infra/jobs/autoInhabilitarJob.ts` consume casos de uso y opera sobre Prisma.
- Configura alertas sobre errores Prisma y BigInt en serialización JSON para detectar incompatibilidades tempranas.
