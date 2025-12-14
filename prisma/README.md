<!-- # README | Propósito: Esquema/consulta README | Pertenece a: Prisma | Interacciones: Base de datos -->

# Carpeta prisma/

Propósito: definir el esquema de base de datos y generar el cliente Prisma para SQL Server.

## Contenido
- `schema.prisma`: modelo relacional con mapeos `@map/@@map`, provider `sqlserver`, y notas de BigInt.
- (Migraciones) No se almacenan aquí; se aplican con `prisma migrate deploy` basadas en este schema.

## Uso
- Generar cliente: `npx prisma generate`
- Aplicar migraciones: `npx prisma migrate deploy` (o `prisma db push` en dev temporal, no recomendado en prod).
- Con SQL Server en docker: levanta con `docker compose up -d sqlserver` antes de correr `migrate` o tests e2e Prisma.

## Notas BigInt
- Prisma retorna `BigInt` para columnas `BigInt` de SQL Server. En los repositorios se normaliza a `Number` en `toDomain` y se usan `BigInt(...)` en filtros/escrituras.
