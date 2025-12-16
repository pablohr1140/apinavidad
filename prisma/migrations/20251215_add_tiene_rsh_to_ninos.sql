-- Añade columna tiene_RSH para marcar Registro Social de Hogares
IF COL_LENGTH('dbo.ninos', 'tiene_RSH') IS NULL
BEGIN
    ALTER TABLE dbo.ninos
        ADD tiene_RSH BIT NOT NULL CONSTRAINT DF_ninos_tiene_RSH DEFAULT 0 WITH VALUES;
END;
