# modules/auth

- Propósito: Módulo NestJS de autenticación/autorización (controladores, guards, servicios Nest).
- Archivos críticos: `auth.controller.ts`, `paseto-auth.guard.ts`, `rate-limit.guard.ts`, `authorization.service.ts`, `refresh-token.store.ts` (inyectado), `auth.module.ts`.
- No debería ir aquí: lógica de dominio o implementación de Prisma.
- Integración frontend: endpoints `/auth/login`, `/auth/refresh`; cookies de acceso/refresh; headers `Authorization` (Bearer) y `X-CSRF-Token` cuando aplique.
