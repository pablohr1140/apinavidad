<!-- # README | Propósito: Archivo README | Pertenece a: General | Interacciones: N/A -->

# Carpeta src/

Propósito: código de aplicación NestJS (bootstrap, configuración, dominio, casos de uso, infraestructura y módulos HTTP).

## Subcarpetas
- `application/`: contratos de repositorio y casos de uso (coordinación de dominio y persistencia).
- `domain/`: entidades y servicios de dominio (reglas de negocio puras).
- `infra/`: adaptadores concretos (Prisma, cache, http, auth, jobs, security).
- `modules/`: módulos Nest por feature (auth, personas, organizaciones, ninos, periodos, reportes, logs) y sus controladores.
- `config/`: configuración de entorno, auth y module-alias.
- `shared/`: utilidades compartidas (logger, feature flags, errores).
- `types/`: definiciones de tipos globales/ambient.

## Entradas principales
- `main.ts`: bootstrap NestJS (CORS, cookies, helmet, puerto desde env).
- `app.module.ts`: módulo raíz que orquesta módulos y guards globales.
- `server.ts`: stub legacy; el arranque real es `main.ts`.
