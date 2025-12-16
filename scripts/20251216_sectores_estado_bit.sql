-- Convert sectores.estado from NVARCHAR to BIT with default 1
DECLARE @dfName sysname;
SELECT @dfName = df.name
FROM sys.default_constraints df
JOIN sys.columns c ON df.parent_object_id = c.object_id AND df.parent_column_id = c.column_id
WHERE df.parent_object_id = OBJECT_ID('dbo.sectores')
  AND c.name = 'estado';

IF @dfName IS NOT NULL
BEGIN
    EXEC('ALTER TABLE dbo.sectores DROP CONSTRAINT ' + QUOTENAME(@dfName));
END;
GO

IF COL_LENGTH('dbo.sectores', 'estado_bit_tmp') IS NULL
BEGIN
    ALTER TABLE dbo.sectores ADD estado_bit_tmp BIT NULL;
END;
GO

UPDATE dbo.sectores
SET estado_bit_tmp = CASE WHEN estado IN ('activo', '1', 'true', 'TRUE') THEN 1 ELSE 0 END;
GO

ALTER TABLE dbo.sectores DROP COLUMN estado;
GO

EXEC sp_rename 'dbo.sectores.estado_bit_tmp', 'estado', 'COLUMN';
GO

ALTER TABLE dbo.sectores ADD CONSTRAINT DF_sectores_estado DEFAULT (1) FOR estado;
GO

UPDATE dbo.sectores SET estado = ISNULL(estado, 1);
GO
