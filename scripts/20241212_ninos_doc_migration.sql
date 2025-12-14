-- Script de migración/seed para esquema ninos (documento_numero, nacionalidad, tipos de documento)
-- Seguro de re-ejecución: incluye IF NOT EXISTS/ALTER para columnas, FKs e índice.
-- Opcional: bloque de recarga desde A_NINOS deshabilitado por defecto.

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

-- 1) Columnas nuevas/ajustes en ninos
--    - documento_numero requerido (ya creado)
--    - documento (legacy), run y dv se eliminan si existen
--    - tipo_documento_id, nacionalidad_id como INT NULL
--    - estado pasa a bit: 1=registrado/habilitado, 0=inhabilitado
--    - persona_registro_id para trazar quién registró al niño
IF NOT EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'documento_numero'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD [documento_numero] NVARCHAR(50) NOT NULL CONSTRAINT [DF_ninos_documento_numero] DEFAULT ('');
END
ELSE
BEGIN
    ALTER TABLE [dbo].[ninos]
        ALTER COLUMN [documento_numero] NVARCHAR(50) NOT NULL;
END;

-- Elimina columna legacy documento si sigue presente
IF EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'documento'
)
BEGIN
    ALTER TABLE [dbo].[ninos] DROP COLUMN [documento];
END;

IF EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'run'
)
BEGIN
    ALTER TABLE [dbo].[ninos] DROP COLUMN [run];
END;

IF EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'dv'
)
BEGIN
    ALTER TABLE [dbo].[ninos] DROP COLUMN [dv];
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'tipo_documento_id'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD [tipo_documento_id] INT NULL;
END;

-- Elimina providencia_id si existe (se modela via organizacion)
IF EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'providencia_id'
)
BEGIN
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_ninos_providencias')
        ALTER TABLE [dbo].[ninos] DROP CONSTRAINT [FK_ninos_providencias];
    ALTER TABLE [dbo].[ninos] DROP COLUMN [providencia_id];
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'nacionalidad_id'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD [nacionalidad_id] INT NULL;
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'persona_registro_id'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD [persona_registro_id] INT NULL;
END;

-- Convertir estado (nvarchar) a bit: 1=registrado/habilitado, 0=inhabilitado
-- Paso 1: si ya es bit, omitir; si es nvarchar, mapear y castear
IF EXISTS (
    SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[ninos]') AND name = 'estado' AND system_type_id IN (35,99,231,239)
)
BEGIN
    -- Remover índice/DF dependientes antes de convertir
    IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_ninos_estado_periodo' AND object_id = OBJECT_ID(N'[dbo].[ninos]'))
    BEGIN
        DROP INDEX [IX_ninos_estado_periodo] ON [dbo].[ninos];
    END;

    DECLARE @df_estado NVARCHAR(200);
    SELECT @df_estado = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c ON c.default_object_id = dc.object_id
    WHERE dc.parent_object_id = OBJECT_ID(N'[dbo].[ninos]') AND c.name = N'estado';
    IF @df_estado IS NOT NULL
    BEGIN
        EXEC('ALTER TABLE [dbo].[ninos] DROP CONSTRAINT [' + @df_estado + ']');
    END;

    -- Normaliza valores
    UPDATE [dbo].[ninos]
    SET estado = CASE WHEN estado IN (N'registrado', N'habilitado', N'1') THEN '1' ELSE '0' END;

    ALTER TABLE [dbo].[ninos] ALTER COLUMN [estado] BIT NOT NULL;

    -- Nuevo default bit en 1
    ALTER TABLE [dbo].[ninos] ADD CONSTRAINT [DF_ninos_estado_bit] DEFAULT ((1)) FOR [estado];

    -- Recrear índice
    CREATE NONCLUSTERED INDEX [IX_ninos_estado_periodo] ON [dbo].[ninos]([estado], [periodo_id]);
END;

-- 2) Índice compuesto documento
IF EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = N'IX_ninos_doc_tipo_numero' AND object_id = OBJECT_ID(N'[dbo].[ninos]')
)
BEGIN
    DROP INDEX [IX_ninos_doc_tipo_numero] ON [dbo].[ninos];
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = N'UQ_ninos_doc_tipo_numero' AND object_id = OBJECT_ID(N'[dbo].[ninos]')
)
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [UQ_ninos_doc_tipo_numero]
        ON [dbo].[ninos]([tipo_documento_id], [documento_numero]);
END;

-- Índice para persona_registro_id si queremos filtrar/auditar
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = N'IX_ninos_persona_registro' AND object_id = OBJECT_ID(N'[dbo].[ninos]')
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_ninos_persona_registro]
        ON [dbo].[ninos]([persona_registro_id]);
END;

-- 3) Seeds de tipo_documentos
MERGE [dbo].[tipo_documentos] AS target
USING (VALUES
    (N'CDI',      N'CDI',      N'Cedula chilena (RUN)'),
    (N'PAS',      N'PAS',      N'Pasaporte'),
    (N'RUTPROV',  N'RUTPROV',  N'RUT provisorio'),
    (N'EE',       N'EE',       N'Documento extranjero'),
    (N'OTRO',     N'OTRO',     N'Otro documento')
) AS src(nombre, codigo, descripcion)
    ON target.codigo = src.codigo
WHEN MATCHED THEN
    UPDATE SET target.nombre = src.nombre,
               target.descripcion = src.descripcion,
               target.activo = 1
WHEN NOT MATCHED THEN
    INSERT (nombre, codigo, descripcion, activo)
    VALUES (src.nombre, src.codigo, src.descripcion, 1);

-- 4) Seed de nacionalidad Chile
MERGE [dbo].[nacionalidades] AS target
USING (VALUES (N'Chile', N'CHL', N'chileno')) AS src(nombre, iso, gentilicio)
    ON target.iso = src.iso
WHEN MATCHED THEN
    UPDATE SET target.nombre = src.nombre,
               target.gentilicio = src.gentilicio,
               target.activo = 1
WHEN NOT MATCHED THEN
    INSERT (nombre, iso, gentilicio, activo)
    VALUES (src.nombre, src.iso, src.gentilicio, 1);

-- 5) FKs (solo si no existen)
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_ninos_tipo_documentos'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD CONSTRAINT [FK_ninos_tipo_documentos]
            FOREIGN KEY ([tipo_documento_id]) REFERENCES [dbo].[tipo_documentos]([id]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_ninos_nacionalidades'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD CONSTRAINT [FK_ninos_nacionalidades]
            FOREIGN KEY ([nacionalidad_id]) REFERENCES [dbo].[nacionalidades]([id]);
END;

IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_ninos_personas_registro'
)
BEGIN
    ALTER TABLE [dbo].[ninos]
        ADD CONSTRAINT [FK_ninos_personas_registro]
            FOREIGN KEY ([persona_registro_id]) REFERENCES [dbo].[personas]([id]);
END;

COMMIT TRANSACTION;
GO

-- 6) (Opcional) Recarga de ninos desde A_NINOS solo para Chile
--    Habilitar cambiando @reload a 1. Limpia ninos, mapea periodo por nombre (= valor de A_NINOS.periodo)
--    y carga como CDI usando dni como documento_numero. Columns de A_NINOS detectadas vía sys.columns.
DECLARE @reload bit = 0;
IF @reload = 1
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    BEGIN TRANSACTION;

    DECLARE @tipoDocCdi INT = (SELECT TOP 1 id FROM [dbo].[tipo_documentos] WHERE codigo = N'CDI');
    DECLARE @nacChile INT = (SELECT TOP 1 id FROM [dbo].[nacionalidades] WHERE iso = N'CHL');

    -- Limpia carga previa
    DELETE FROM [dbo].[ninos];

    INSERT INTO [dbo].[ninos] (
        nombres,
        documento_numero,
        tipo_documento_id,
        nacionalidad_id,
        fecha_nacimiento,
        sexo,
        organizacion_id,
        periodo_id,
        es_prioritario,
        edad,
        tiene_discapacidad,
        fecha_ingreso,
        fecha_retiro,
        estado,
        persona_registro_id,
        created_at,
        updated_at
    )
    SELECT
        AN.nombre,
        AN.dni AS documento_numero,
        @tipoDocCdi,
        @nacChile,
        AN.fechaNacimiento,
        AN.sexo,
        AN.idOrganizacion,
        P.id AS periodo_id,
        0 AS es_prioritario,
        AN.edad,
        ISNULL(AN.checkDiscapacitado, 0),
        AN.fechaRegistro AS fecha_ingreso,
        NULL AS fecha_retiro,
        CAST(AN.estado AS BIT) AS estado,
        AN.idPersonalRegistro AS persona_registro_id,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    FROM [dbo].[A_NINOS] AN
    INNER JOIN [dbo].[periodos] P ON P.nombre = CAST(AN.periodo AS NVARCHAR(200))
    WHERE AN.idNacionalidad = 1;

    COMMIT TRANSACTION;
END;
GO
