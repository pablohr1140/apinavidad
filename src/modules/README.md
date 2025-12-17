<!-- # README | Propósito: Elemento de módulo README | Pertenece a: Módulo Nest | Interacciones: NestJS providers/controllers -->

# Carpeta modules/

Propósito: agrupar módulos NestJS por feature (auth, personas, organizaciones, ninos, periodos, reportes, logs).

Qué encuentra el frontend aquí
- Controladores HTTP y sus rutas (ver JSDoc en cada controller para contratos de body/query/headers/cookies/permisos).
- Guards globales aplican PASETO + permisos; endpoints públicos explícitos solo en `auth` (login/refresh) y `shared/health`.
- Decoradores clave: `@Public` (omite auth), `@Permissions` (exige permisos), `@AuthUser` (inyecta usuario autenticado), `@RateLimit` (solo en auth).

Relaciones:
- Orquestados por `app.module.ts`.
- Dependen de casos de uso en `application/use-cases` e implementaciones en `infra/` (DB/Redis/reporting).

Integración rápida (referencia descriptiva)
- Auth: POST /auth/login y /auth/refresh devuelven JSON y setean cookies HttpOnly; enviar `X-CSRF-Token` en POST.
- Reportes: GET/POST bajo `/reportes/*` requieren permiso `ninos.view`; CSRF en POST exports; descargas usan cookies.
- Niños/Organizaciones/Personas/Periodos: CRUD protegido por permisos; mutaciones requieren `X-CSRF-Token` y cookies de sesión.
