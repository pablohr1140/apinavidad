-- Create sectores table and wire sector_id in organizaciones
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'sectores' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.sectores (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre NVARCHAR(255) NOT NULL,
        estado NVARCHAR(50) NOT NULL CONSTRAINT DF_sectores_estado DEFAULT ('activo'),
        created_at DATETIME2 NOT NULL CONSTRAINT DF_sectores_created_at DEFAULT (sysdatetime()),
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_sectores_updated_at DEFAULT (sysdatetime())
    );

    CREATE UNIQUE INDEX UQ_sectores_nombre ON dbo.sectores (nombre);
END;
GO

-- Add sector_id column to organizaciones if missing
IF COL_LENGTH('dbo.organizaciones', 'sector_id') IS NULL
BEGIN
    ALTER TABLE dbo.organizaciones ADD sector_id INT NULL;
END;
GO

-- Add FK organizaciones -> sectores if missing
IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_organizaciones_sectores'
      AND parent_object_id = OBJECT_ID('dbo.organizaciones')
)
BEGIN
    ALTER TABLE dbo.organizaciones
    ADD CONSTRAINT FK_organizaciones_sectores
    FOREIGN KEY (sector_id)
    REFERENCES dbo.sectores (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
END;
GO
