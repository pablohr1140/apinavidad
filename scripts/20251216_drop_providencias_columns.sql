-- Drop unused columns from providencias
-- Run against BD_NAVIDAD before regenerating Prisma client

SET NOCOUNT ON;

IF COL_LENGTH('dbo.providencias','region') IS NOT NULL
  ALTER TABLE dbo.providencias DROP COLUMN region;
IF COL_LENGTH('dbo.providencias','comuna') IS NOT NULL
  ALTER TABLE dbo.providencias DROP COLUMN comuna;
IF COL_LENGTH('dbo.providencias','descripcion') IS NOT NULL
  ALTER TABLE dbo.providencias DROP COLUMN descripcion;
IF COL_LENGTH('dbo.providencias','activo') IS NOT NULL
  ALTER TABLE dbo.providencias DROP COLUMN activo;
