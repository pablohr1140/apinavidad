<!-- # prisma integration tests | Propósito: Documento prisma integration tests | Pertenece a: Documentación | Interacciones: Texto de referencia -->

<!--
# prisma-integration-tests.md

Propósito: guiar pruebas integradas de lecturas Prisma (organizaciones/personas) bajo flags `PRISMA_READS/WRITES`.
Responsabilidades: definir entorno, datos iniciales, escenarios e2e y observaciones.
Interacciones: usa `PrismaService`, repos Prisma, SQL Server docker y suites Vitest e2e.
Depende de: schema Prisma, feature flags y tareas docker.
Pertenece a: documentación de QA para la migración a Prisma.
-->

# Plan de pruebas integradas para la ruta Prisma

## Objetivo
Garantizar que los módulos `Organizaciones` y `Personas` atienden las peticiones de lectura utilizando los repositorios Prisma cuando `PRISMA_READS=1`, validando tanto la integración con SQL Server como la forma en que se serializan las respuestas HTTP.

## Variables y entorno
- `PRISMA_READS=1` obliga a los módulos a resolver `OrganizacionRepository` y `PersonaRepository` con las implementaciones Prisma.
- `PRISMA_WRITES=1` deja constancia de que las rutas mutadoras también se validarán con Prisma; si lo omites, los logs advertirán que todavía estás en modo sólo lecturas.
- `DATABASE_URL` opcional. Si no se define, Prisma construye la cadena con `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (ver `PrismaService`).
- `NODE_ENV=test` permite reutilizar la configuración de Vitest; para pruebas manuales/e2e se recomienda `NODE_ENV=development` con logs de Prisma en modo `warn` + `error`.
- Servicios externos: Redis no es requerido para los endpoints a cubrir. Basta con levantar SQL Server vía `docker compose up -d sqlserver` (tarea `docker:sqlserver-up`).

## Datos iniciales
1. Ejecutar migraciones/DDL Prisma para asegurar el esquema (`npx prisma migrate deploy` o `prisma db push` según el flujo actual).
2. Popular las tablas mínimas:
   - `organizaciones`: al menos dos registros con distintos `estado`/`tipo` para probar filtros.
   - `personas`, `roles` y `persona_roles`: un usuario con `role_key=ADMIN` y otro con `role_key=DIDECO` ligado a diferentes organizaciones.
   - Se puede reutilizar `npm run seed` si ya sincroniza ambos mundos; en caso contrario, preparar un script SQL o `prisma db seed` específico para estas pruebas.

## Escenarios propuestos
1. **GET /organizaciones?estado=activo**
   - Preparar registros con estados mixtos.
   - Esperado: respuesta ordenada por `created_at desc`, sólo Prisma debe ser invocado (verificar con spies o logs).
   - Variante incluida en `tests/e2e/prisma-read.spec.ts`: pasar valores con espacios (`%20activo%20`) para validar que el controlador hace `trim` antes de llegar al repositorio Prisma.
2. **GET /organizaciones/:id**
   - Caso feliz: retorna el dominio mapeado por Prisma.
   - Caso 404: id inexistente -> el controlador deberá traducir el `null` a `NotFoundException`.
   - El spec ya cubre ambos flujos (incluyendo el `AppError` de Prisma cuando no hay coincidencias).
3. **GET /personas?organizacionId={id}&search=texto**
   - Valida la composición de filtros `OR` sobre nombre/apellido/run y la relación `organizacion_persona`.
4. **GET /personas/:id**
   - Debe retornar roles enriquecidos desde Prisma (`persona_roles.roles`).
5. **DELETE /personas/:id**
   - Aunque Prisma sólo está enchufado para lecturas, confirmar que la ruta elimina usando Prisma sin inconsistencias de pivotes.

Cada escenario debe ejecutarse dos veces: con `PRISMA_READS=1` (esperado) y con `PRISMA_READS=0` (control) para validar que la alternancia entre repos funciona sin reiniciar la app.

## Flujo sugerido de ejecución
1. `npm run prisma:generate` para sincronizar el cliente tras cualquier cambio de esquema.
2. Levantar SQL Server (`task: docker:sqlserver-up`).
3. Aplicar migraciones y seed.
4. `PRISMA_READS=1 npx vitest run tests/e2e/prisma-route.spec.ts` (nuevo archivo) o ejecutar `npm run test:e2e` si se integran allí.
5. Registrar métricas de cobertura (Vitest ya reporta V8). El objetivo es cubrir las ramas pendientes en `PrismaOrganizacionRepository` y `PrismaPersonaRepository`.

## Observaciones finales
- Centralizar helpers de seed/datos en `tests/e2e/utils/prisma.ts` para poder resets rápidos (limpieza vía `prisma.$transaction([deleteMany(...)])`).
- Instrumentar logs (`Logger.debug`) en los proveedores de repositorio para confirmar, durante la prueba, qué implementación quedó activa.
- Documentar en el README cómo habilitar `PRISMA_READS` en entornos temporales para evitar confusiones cuando se mezclen repositorios.
