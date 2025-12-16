-- Drop column descripcion from periodos (SQL Server)
-- Run against BD_NAVIDAD with the same credentials as .env
-- Example: sqlcmd -S localhost,1433 -U testeo -P 1122 -d BD_NAVIDAD -C -i scripts/20251215_drop_periodos_descripcion.sql

SET NOCOUNT ON;

IF EXISTS (
  SELECT 1
  FROM sys.columns c
  WHERE c.name = 'descripcion' AND c.object_id = OBJECT_ID('[dbo].[periodos]')
)
BEGIN
  ALTER TABLE [dbo].[periodos]
  DROP COLUMN [descripcion];
END
