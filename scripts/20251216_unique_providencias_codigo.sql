-- Enforce uniqueness on providencias.codigo (ignores NULL duplicates by SQL Server rules)
SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'UQ_providencias_codigo' AND object_id = OBJECT_ID('dbo.providencias')
)
BEGIN
    CREATE UNIQUE INDEX UQ_providencias_codigo ON dbo.providencias (codigo) WHERE codigo IS NOT NULL;
END;
GO
