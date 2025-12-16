-- Añade columna etnia_id en ninos y la rellena desde A_NINOS.idEtnia
IF COL_LENGTH('dbo.ninos', 'etnia_id') IS NULL
BEGIN
    ALTER TABLE dbo.ninos ADD etnia_id INT NULL;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'FK_ninos_etnias'
)
BEGIN
    ALTER TABLE dbo.ninos
        WITH CHECK ADD CONSTRAINT FK_ninos_etnias FOREIGN KEY (etnia_id)
            REFERENCES dbo.etnias (id);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'IX_ninos_etnia_id' AND object_id = OBJECT_ID('dbo.ninos')
)
BEGIN
    CREATE INDEX IX_ninos_etnia_id ON dbo.ninos (etnia_id);
END;

-- Migra datos desde A_NINOS usando coincidencia por documento
UPDATE n
SET n.etnia_id = a.idEtnia
FROM dbo.ninos AS n
INNER JOIN dbo.A_NINOS AS a
    ON n.documento_numero = a.dni
WHERE a.idEtnia IS NOT NULL;
