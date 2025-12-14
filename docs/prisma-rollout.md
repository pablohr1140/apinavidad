<!-- # prisma rollout | Propósito: Documento prisma rollout | Pertenece a: Documentación | Interacciones: Texto de referencia -->

<!--
# prisma-rollout.md

Propósito: guiar el despliegue de Prisma (único stack de persistencia).
Responsabilidades: checklist de staging, smoke tests, observabilidad y rollback.
Interacciones: usa variables de base de datos, tareas docker de SQL Server y suites e2e Prisma.
Depende de: `PrismaService`, env vars de base y scripts de seed.
Pertenece a: documentación operativa de despliegue.
-->

# Plan de despliegue de Prisma

## Objetivo
Prisma es el único cliente de base de datos. Este documento resume el checklist para desplegar cambios sin depender de un stack alterno.

## Checklist para staging

1. **Preparación del entorno**  
   - Asegura que `DATABASE_URL` apunte al clúster SQL Server correcto (o define `DB_HOST/PORT/USER/PASSWORD/NAME`).  
   - Ejecuta `npm run prisma:generate` y, si manejas migraciones, `npx prisma migrate deploy`.  
   - Levanta SQL Server local con `docker compose up -d sqlserver` si necesitas una base de prueba.

2. **Smoke tests automáticos**  
   - Ejecuta `npx vitest run tests/e2e/prisma-read.spec.ts`.  
   - Ejecuta `npx vitest run tests/e2e/prisma-write.spec.ts`.  
   - Opcional: `RUN_PRISMA_SQLSERVER_TESTS=true npx vitest run tests/e2e/prisma-read.sqlserver.spec.ts` cuando el entorno tenga SQL Server disponible.

3. **Observabilidad inicial**  
   - Habilita logs de Prisma (`log: ['query','error','warn']` en `PrismaService` cuando corresponda) y monitorea errores de serialización `BigInt`.  
   - Revisa que el job `autoInhabilitar` inicie sin warnings.

4. **Despliegue**  
   - Ejecuta `npm run build` y publica el artefacto.  
   - Si necesitas datos base, corre `npm run seed` (idempotente) apuntando al entorno de staging.

5. **Monitoreo post-deploy**  
   - Supervisa métricas de error rate y latencia en endpoints `POST/PUT/DELETE`.  
   - Observa logs de Prisma para detectar timeouts o deadlocks.

6. **Rollback rápido**  
   - Si detectas problemas, revierte la app a la versión anterior y, si aplica, revierte migraciones desde tu pipeline.  
   - Documenta los tests fallidos y adjunta query logs relevantes.

## Consideraciones adicionales

- **Seeds**: `npm run seed` usa Prisma y es idempotente. Ajusta los datos semilla antes de correrlo en ambientes compartidos.
- **CI**: si tu pipeline dispone de SQL Server en contenedores, agrega un job opcional que levante la DB (`docker compose up -d sqlserver`) y corra `prisma-read.sqlserver` para detectar incompatibilidades temprano.
- **Comunicación**: coordina con soporte la ventana de despliegue y comparte las consultas/alertas configuradas para Prisma.
- **BigInt en SQL Server**: Prisma retorna `bigint` como `BigInt` en JS. Convierte a `Number` en `toDomain` antes de serializar JSON (ej. `PrismaOrganizacionRepository`, `PrismaNinoRepository`, `PrismaLogRepository`) y usa `BigInt(...)` en filtros/creación para columnas `BigInt`.

## Validación del seed

1. **Preparar la base**  
   - Levanta SQL Server local con `docker compose up -d sqlserver` (o confirma acceso al clúster remoto).  
   - Exporta `DATABASE_URL` apuntando al servidor que vas a poblar.

2. **Ejecutar seed**  
   - Comando: `npm run seed` (usa Prisma).  
   - Resultado esperado: inserciones idempotentes sin duplicados; revisa consola por advertencias.

3. **Verificaciones posteriores**  
   - Corre `npx vitest run tests/e2e/prisma-write.spec.ts` y, si aplica, `RUN_PRISMA_SQLSERVER_TESTS=true npx vitest run tests/e2e/prisma-read.sqlserver.spec.ts`.  
   - Registra fecha, entorno y observaciones cuando completes la validación.  
   - Finaliza bajando el contenedor con `docker compose down` para dejar limpio el entorno.
