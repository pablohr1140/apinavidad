<!-- # prisma writes plan | Propósito: Documento prisma writes plan | Pertenece a: Documentación | Interacciones: Texto de referencia -->

<!--
# prisma-writes-plan.md

Propósito: describir cómo consolidar escrituras Prisma.
Responsabilidades: definir cambios propuestos, estrategia y plan de pruebas.
Interacciones: repositorios Prisma, configuración de `env`, suites unitarias y e2e de escrituras.
Depende de: implementaciones Prisma, `PrismaService` y CI.
Pertenece a: documentación de migración/operativa.
-->

# Plan para habilitar escrituras con Prisma

## Objetivo
Consolidar las operaciones de escritura (create/update/delete) en Prisma, aumentando cobertura y resiliencia sin depender de otro ORM.

## Estado actual
- Prisma es el único stack de persistencia.
- Los repositorios Prisma implementan `create`, `update` y `delete`, pero algunas rutas carecen de cobertura integral y validación contra SQL Server real.
- `PrismaService` construye `DATABASE_URL` automáticamente y comparte conexión global.

## Cambios propuestos
1. **Cobertura de repositorios Prisma**
   - Organizaciones y Personas: extender unit tests para cubrir `create/update/delete` (incluyendo paths de errores `P2025` y validaciones de campos opcionales).
   - Ninos, Periodos, OrganizacionesPeriodo, Logs: mantener paridad funcional y cobertura para rutas críticas.

2. **Casos de uso y controladores**
   - Revisar cada `UseCase` que toca escrituras y garantizar que la interfaz del repositorio Prisma cubre métodos como `addRole` o `linkOrganizacion`.
   - Añadir pruebas unitarias de casos de uso validando la lógica con stubs que reflejen la API de Prisma.

3. **Pruebas E2E**
   - `tests/e2e/prisma-write.spec.ts` debe ejercitar: `POST /organizaciones`, `PUT /organizaciones/:id` (incluyendo 404 por `P2025`), `POST /personas` con `roleKeys` y `DELETE /personas/:id` limpiando pivotes.
   - Reutilizar helpers del spec `prisma-read` para limpiar tablas entre tests (`prisma.$transaction([deleteMany(...)])`).

4. **Validación contra SQL Server**
   - Flujo reproducible: `docker compose up -d sqlserver`, `npm run prisma:generate`, `npx prisma migrate deploy` (si aplica) y `npm run seed`.
   - Ejecutar pruebas E2E sobre SQL Server real y registrar queries relevantes (`log: ['query','error','warn']`).

## Plan de pruebas
- **Unitarias**: stubs de `PrismaService` con `vi.fn()` validando payloads (`create`, `update`, `delete`).
- **Integradas**: Vitest + Nest + supertest (similar a `prisma-read`), reinyectando casos de uso con repos Prisma y controlando las respuestas HTTP.
- **E2E**: suite `prisma-write` sobre SQL Server local o real; limpiar tablas entre tests.
- **Cobertura dinámica**: objetivo mínimo 80% de statements y 70% de branches en repos Prisma.

## Riesgos y mitigaciones
- **Desfase de esquema**: automatizar `prisma generate` en CI y en scripts locales (pretest hook).
- **Transacciones multi-tabla**: encapsular en `PrismaService.$transaction` y cubrir con pruebas que validen efectos en cascada.
- **Performance/locking**: monitorear timeouts y deadlocks en SQL Server; ajustar `pool`/timeouts de Prisma según métricas.
