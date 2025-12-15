<!-- # prisma migration plan | Propósito: Documento prisma migration plan | Pertenece a: Documentación | Interacciones: Texto de referencia -->

<!--
# prisma-migration-plan.md

Propósito: detallar el plan de migración de TypeORM a Prisma (alcance, fases, riesgos, rollback).
Responsabilidades: describir objetivos, estrategia de esquema, fases de adopción, validación y comunicación.
Interacciones: depende de entidades actuales en `src/infra/database/entities`, flags en `src/shared/prisma-flags`, y toolchain Prisma.
Pertenece a: documentación de proyecto/migración.
-->

# Plan de migración de TypeORM a Prisma

> Estado: histórico. TypeORM ya fue removido; este documento se conserva únicamente como referencia del plan ejecutado.

> Nota 2025-12-14 (manual SQL): se reordenó físicamente la tabla `ninos`, se eliminaron las columnas `run` y `dv`, se recrearon las FK (`FK_ninos_periodos`, `FK_ninos_organizaciones`, `FK_ninos_tipo_documentos`, `FK_discapacidad_nino_ninos`) y se eliminó la tabla temporal `ninos_old`. Prisma Client regenerado (`npm run prisma:generate`).

## 1. Objetivos
- Mantener la paridad funcional del backend NestJS mientras se reemplaza TypeORM por Prisma como ORM principal.
- Reducir el tiempo de generación de tipos y mejorar la DX (autocompletado, validación estática) gracias al cliente tipado de Prisma.
- Minimizar downtime durante la transición mediante una estrategia incremental y múltiples puntos de rollback.

## 2. Alcance
- Modelos actuales: personas, roles, permisos, organizaciones, periodos, niños, discapacidades, logs y tablas pivote (`organizacion_persona`, `organizacion_periodo`, `persona_roles`, `role_permissions`, etc.).
- Conexión SQL Server 2022/2019 (compatibilidad `mssql`).
- Jobs, seeds y migraciones personalizadas.
- No se contempla movernos de SQL Server ni reescribir módulos de caché/auth.

## 3. Preparación
1. **Inventario de entidades**: exportar el esquema actual (p. ej. `npx typeorm schema:log`) y mapearlo con la metadata en `src/infra/database/entities`.
2. **Congelar migraciones TypeORM**: definir una última migración "de corte" y publicarla en `master` para evitar drift.
3. **Crear rama larga `feat/prisma`** para iterar y permitir merges parciales vía feature flags.
4. **Actualizar toolchain**: instalar `prisma`, `@prisma/client`, `ts-node` (ya presente) y configurar scripts `prisma:generate`, `prisma:migrate`.

## 4. Diseño del esquema Prisma
- Generar `prisma/schema.prisma` apuntando a SQL Server (`provider = "sqlserver"`).
- Mapear tablas existentes usando `@@map` y `@map` para conservar nombres snake_case cuando sea necesario.
- Definir `enum`s para estados (`EstadoNino`, `EstadoPeriodo`, etc.).
- Usar `relationMode = "prisma"` para aprovechar claves foráneas ya creadas y `referentialIntegrity = foreignKeys`.
- Validar que campos `decimal`/`money` y `datetime2` tengan equivalentes en Prisma, usando `Decimal`/`DateTime` y anotaciones `@db.Decimal(10,2)`, `@db.DateTime(3)`.

## 5. Estrategia de migración
### Fase 0 – Dual stack (lectura Prisma, escritura TypeORM)
- Introducir un módulo `PrismaService` en `src/infra/database/prisma` sin reemplazar repositorios existentes.
- Implementar adaptadores read-only para casos de uso críticos (ej. `ListPersonasUseCase`) y comparar resultados via feature flag (`PRISMA_READS=1`).
- Añadir métricas/logs para comparar tiempos de respuesta y detectar discrepancias.

### Fase 1 – Reemplazo de repositorios
- Por cada repositorio TypeORM:
  1. Crear contraparte Prisma (`PrismaPersonaRepository`).
  2. Cubrirlo con las pruebas unitarias actuales reutilizando `vitest` + `prisma db push` contra una base temporal o SQLite en memoria si se permite.
  3. Usar inyección condicional (provider token configurable vía ENV) para poder canjear en caliente.
- Reescribir seeds utilizando `prisma.$transaction` y `upsert` donde aplique.

### Fase 2 – Migraciones y toolchain
- Congelar las migraciones TypeORM; crear un script one-off que convierta las migraciones existentes a SQL puro (si se deben re-ejecutar).
- Inicializar migraciones Prisma (`npx prisma migrate diff`) partiendo del estado real de SQL Server y generar una migración base sin cambios (`baseline`).
- Actualizar pipelines CI/CD para ejecutar `prisma migrate deploy` y `prisma generate` en lugar de `typeorm migration:run`.

### Fase 3 – Limpieza
- Eliminar entidades TypeORM, `AppDataSource`, custom repositories y scripts asociados.
- Retirar dependencias (`typeorm`, `ts-node/register`, decoradores específicos, etc.).
- Documentar nuevas convenciones en `docs/architecture.md` y `README`.

## 6. Validación y QA
- Ejecutar suites unitarias y e2e contra instancias Prisma.
- Configurar ambientes paralelos (beta) con tráfico espejado para validar consultas.
- Comparar planes de ejecución y tiempos; afinar índices si Prisma genera SQL diferente.

## 7. Rollback
- Mantener la rama TypeORM congelada y deployable hasta completar la validación.
- Si una migración Prisma falla, usar `prisma migrate resolve --rolled-back` y re-deployar la imagen anterior (que aún contiene TypeORM).
- Documentar checklist para volver a scripts TypeORM (`npm run migration:run`, `npm run seed`) en caso de revertir la imagen.

## 8. Comunicación
- Compartir timeline con stakeholders (fecha de code-freeze, fases, ventanas de mantenimiento).
- Preparar notas de release destacando los cambios operativos (nuevos comandos, variables).

## 9. Próximos pasos inmediatos
1. Agregar dependencias Prisma y generar `schema.prisma` inicial con introspección (`npx prisma db pull`).
2. Crear `PrismaService` y wiring mínimo en Nest.
3. Definir feature flag/env var para seleccionar implementación de repositorios.
4. Programar workshop interno para alinear al equipo en flujos Prisma (migrate, studio, client API).

## 10. Plan operativo Fase 0.1 – Repositorios Prisma
1. **Feature flag + tokens**: exponer una variable `PRISMA_READS=1` y un provider token `PERSONA_REPOSITORY` que permita escoger entre TypeORM y Prisma desde `AppModule`. Documentar el toggle en `.env.example`.
2. **Mapeos compartidos**: crear helpers `prismaPersonaToDomain`, `prismaOrganizacionToDomain`, etc., para reutilizar lógica entre repos e impedir drift de campos.
3. **Repos read-only**: implementar `PrismaPersonaRepository` (metodos `findById`, `list`, `searchByDocumento`) usando `PrismaService`, `select` mínimo y paginado determinista. Añadir pruebas unitarias duplicando el suite actual contra una base temporaria (`npm run test:prisma` futuro).
4. **Inyección condicional**: modificar los módulos (`PersonasModule`, `OrganizacionesModule`, etc.) para resolver el repositorio desde un factory que inspecciona el flag y loguea qué implementación quedó activa.
5. **Telemetría**: envolver cada llamada Prisma en un `try/catch` que reporte duración y discrepancias contra la invocación TypeORM (ej. comparar `total` y `ids`). Guardar métricas en `logs_activity` o enviar a APM.
6. **Rollback rápido**: si Prisma arroja excepción, degradar automáticamente a TypeORM dentro del factory para evitar downtime mientras investigamos.
7. **Checklist de QA**: antes de promover a producción, ejecutar `ListPersonasUseCase`, `ListOrganizacionesUseCase` y `ListNinosUseCase` en paralelo (Prisma vs TypeORM) y adjuntar diff en el PR.

## 11. Comparativas automatizadas
- Script `npm run diag:compare-personas`: inicializa ambos repos (TypeORM + Prisma) directamente y valida que devuelven el mismo set de personas. Úsalo antes y después de tocar el flag para detectar divergencias.
- Extender el script a organizaciones/períodos reutilizando los helpers de mapeo. Documentar los resultados en el PR (ej. `0 diffs / 0 missing`).
- Integrar el script en CI opcionalmente detrás de un job manual (`workflow_dispatch`) para no impactar la pipeline principal.

## 12. Activación controlada en staging
1. **Preparación**: desplegar la rama con los repos duales y asegurar que `DATABASE_URL` apunta a la base de staging. Ejecutar `npm run diag:compare-personas` y su versión para organizaciones antes de tocar flags.
2. **Habilitación**: setear `PRISMA_READS=true` en el entorno de staging (secreto o variable). Reiniciar la app para que el flag tome efecto y confirmar en logs de arranque qué repos se activaron.
3. **Monitoreo**: durante al menos 24h recoger métricas de tiempos y errores de los módulos migrados. Comparar dashboards vs baseline TypeORM.
4. **Rollback instantáneo**: ante cualquier anomalía, revertir el flag a `false` y reiniciar el pod. El factory regresará a TypeORM sin redeploy.
5. **Checklist de salida**: documentar resultados en este plan (fecha, responsables, métricas) y habilitar tráfico hacia producción SOLO si no hubo diffs ni alertas.
