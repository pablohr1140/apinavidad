-- Backfill etnias from A_NINOS and resequence ninos IDs starting at 1
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRAN;

    /* 1) Insert missing etnias based on A_NINOS.idEtnia */
    SET IDENTITY_INSERT dbo.etnias ON;
    INSERT INTO dbo.etnias (id, nombre, codigo, descripcion, activo, created_at, updated_at)
    SELECT src.idEtnia,
           CONCAT('Etnia ', src.idEtnia) AS nombre,
           NULL AS codigo,
           NULL AS descripcion,
           1 AS activo,
           sysdatetime(),
           sysdatetime()
    FROM (SELECT DISTINCT idEtnia FROM dbo.A_NINOS WHERE idEtnia IS NOT NULL) AS src
    LEFT JOIN dbo.etnias e ON e.id = src.idEtnia
    WHERE e.id IS NULL;
    SET IDENTITY_INSERT dbo.etnias OFF;

    /* 2) Backfill ninos.etnia_id where we have matching etnia */
    UPDATE n
    SET n.etnia_id = a.idEtnia
    FROM dbo.ninos AS n
    INNER JOIN dbo.A_NINOS AS a ON n.documento_numero = a.dni
    INNER JOIN dbo.etnias AS e ON e.id = a.idEtnia;

    /* 3) Resequence ninos IDs starting at 1 while keeping column order and defaults */

    -- Drop FK from discapacidad_nino -> ninos
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_discapacidad_nino_ninos')
        ALTER TABLE dbo.discapacidad_nino DROP CONSTRAINT FK_discapacidad_nino_ninos;

    -- Drop outgoing FKs to allow table swap
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_organizaciones')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_organizaciones;
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_periodos')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_periodos;
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_tipo_documentos')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_tipo_documentos;
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_nacionalidades')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_nacionalidades;
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_etnias')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_etnias;
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_ninos_personas_registro')
        ALTER TABLE dbo.ninos DROP CONSTRAINT FK_ninos_personas_registro;

    -- Clean persona_registro_id that no longer exists
    UPDATE n
    SET persona_registro_id = NULL
    FROM dbo.ninos AS n
    LEFT JOIN dbo.personas p ON n.persona_registro_id = p.id
    WHERE n.persona_registro_id IS NOT NULL AND p.id IS NULL;

    -- Table with new identity/constraints in requested column order
    IF OBJECT_ID('dbo.ninos_reseq', 'U') IS NOT NULL DROP TABLE dbo.ninos_reseq;

    CREATE TABLE dbo.ninos_reseq (
        id                  BIGINT IDENTITY(1,1) NOT NULL,
        documento_numero    NVARCHAR(50) NOT NULL,
        tipo_documento_id   INT NULL,
        nombres             NVARCHAR(200) NOT NULL,
        apellidos           NVARCHAR(200) NULL,
        fecha_nacimiento    DATE NULL,
        edad                TINYINT NULL,
        sexo                NVARCHAR(1) NULL,
        nacionalidad_id     INT NULL,
        etnia_id            INT NULL,
        organizacion_id     BIGINT NULL,
        periodo_id          INT NOT NULL,
        persona_registro_id INT NULL,
        tiene_discapacidad  BIT NOT NULL CONSTRAINT DF_ninos_reseq_tiene_discapacidad DEFAULT (0),
        es_prioritario      BIT NOT NULL CONSTRAINT DF_ninos_reseq_es_prioritario DEFAULT (0),
        tiene_RSH           BIT NOT NULL CONSTRAINT DF_ninos_reseq_tiene_RSH DEFAULT (0),
        estado              BIT NOT NULL CONSTRAINT DF_ninos_reseq_estado_bit DEFAULT (1),
        fecha_ingreso       DATE NULL,
        fecha_retiro        DATE NULL,
        created_at          DATETIME2 NOT NULL CONSTRAINT DF_ninos_reseq_created_at DEFAULT (sysdatetime()),
        updated_at          DATETIME2 NOT NULL CONSTRAINT DF_ninos_reseq_updated_at DEFAULT (sysdatetime()),
        CONSTRAINT PK_ninos_reseq PRIMARY KEY CLUSTERED (id)
    );

    -- Build mapping old->new IDs and insert data with deterministic order (by old id)
    DECLARE @map TABLE (old_id BIGINT, new_id BIGINT);
    DECLARE @ordered TABLE (
        old_id BIGINT,
        rn BIGINT,
        documento_numero NVARCHAR(50),
        tipo_documento_id INT NULL,
        nombres NVARCHAR(200),
        apellidos NVARCHAR(200) NULL,
        fecha_nacimiento DATE NULL,
        edad TINYINT NULL,
        sexo NVARCHAR(1) NULL,
        nacionalidad_id INT NULL,
        etnia_id INT NULL,
        organizacion_id BIGINT NULL,
        periodo_id INT,
        persona_registro_id INT NULL,
        tiene_discapacidad BIT,
        es_prioritario BIT,
        tiene_RSH BIT,
        estado BIT,
        fecha_ingreso DATE NULL,
        fecha_retiro DATE NULL,
        created_at DATETIME2,
        updated_at DATETIME2
    );

    INSERT INTO @ordered
    SELECT
        n.id AS old_id,
        ROW_NUMBER() OVER (ORDER BY n.id) AS rn,
        n.documento_numero,
        n.tipo_documento_id,
        n.nombres,
        n.apellidos,
        n.fecha_nacimiento,
        n.edad,
        n.sexo,
        n.nacionalidad_id,
        n.etnia_id,
        n.organizacion_id,
        n.periodo_id,
        n.persona_registro_id,
        n.tiene_discapacidad,
        n.es_prioritario,
        n.tiene_RSH,
        n.estado,
        n.fecha_ingreso,
        n.fecha_retiro,
        n.created_at,
        n.updated_at
    FROM dbo.ninos AS n;

    SET IDENTITY_INSERT dbo.ninos_reseq ON;
    INSERT INTO dbo.ninos_reseq (
        id, documento_numero, tipo_documento_id, nombres, apellidos, fecha_nacimiento, edad, sexo,
        nacionalidad_id, etnia_id, organizacion_id, periodo_id, persona_registro_id,
        tiene_discapacidad, es_prioritario, tiene_RSH, estado,
        fecha_ingreso, fecha_retiro, created_at, updated_at
    )
    SELECT rn, documento_numero, tipo_documento_id, nombres, apellidos, fecha_nacimiento, edad, sexo,
           nacionalidad_id, etnia_id, organizacion_id, periodo_id, persona_registro_id,
           tiene_discapacidad, es_prioritario, tiene_RSH, estado,
           fecha_ingreso, fecha_retiro, created_at, updated_at
    FROM @ordered;
    SET IDENTITY_INSERT dbo.ninos_reseq OFF;

    -- Save mapping
    INSERT INTO @map (old_id, new_id)
    SELECT old_id, rn FROM @ordered;

    -- Swap tables
    DROP TABLE dbo.ninos;
    EXEC sp_rename 'dbo.ninos_reseq', 'ninos';

    -- Rename constraints to canonical names
    EXEC sp_rename 'DF_ninos_reseq_tiene_discapacidad', 'DF_ninos_tiene_discapacidad', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reseq_es_prioritario', 'DF_ninos_es_prioritario', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reseq_tiene_RSH', 'DF_ninos_tiene_RSH', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reseq_estado_bit', 'DF_ninos_estado_bit', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reseq_created_at', 'DF_ninos_created_at', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reseq_updated_at', 'DF_ninos_updated_at', 'OBJECT';
    EXEC sp_rename 'PK_ninos_reseq', 'PK_ninos';

    -- Recreate indexes
    CREATE UNIQUE INDEX UQ_ninos_doc_tipo_numero ON dbo.ninos (tipo_documento_id, documento_numero);
    CREATE INDEX IX_ninos_estado_periodo ON dbo.ninos (estado, periodo_id);
    CREATE INDEX IX_ninos_etnia_id ON dbo.ninos (etnia_id);

    -- Update discapacidad_nino references using mapping before adding FK back
    UPDATE dn
    SET nino_id = m.new_id
    FROM dbo.discapacidad_nino AS dn
    INNER JOIN @map AS m ON dn.nino_id = m.old_id;

    -- Restore outgoing FKs
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_organizaciones FOREIGN KEY (organizacion_id) REFERENCES dbo.organizaciones (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_periodos FOREIGN KEY (periodo_id) REFERENCES dbo.periodos (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_tipo_documentos FOREIGN KEY (tipo_documento_id) REFERENCES dbo.tipo_documentos (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_nacionalidades FOREIGN KEY (nacionalidad_id) REFERENCES dbo.nacionalidades (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_etnias FOREIGN KEY (etnia_id) REFERENCES dbo.etnias (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_personas_registro FOREIGN KEY (persona_registro_id) REFERENCES dbo.personas (id) ON UPDATE NO ACTION;

    -- Restore incoming FK after data fix
    ALTER TABLE dbo.discapacidad_nino WITH CHECK ADD CONSTRAINT FK_discapacidad_nino_ninos FOREIGN KEY (nino_id) REFERENCES dbo.ninos (id) ON DELETE CASCADE ON UPDATE NO ACTION;

    -- Reseed identity to max id
    DECLARE @maxId BIGINT;
    SELECT @maxId = MAX(id) FROM dbo.ninos;
    DBCC CHECKIDENT('dbo.ninos', RESEED, @maxId) WITH NO_INFOMSGS;

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
END CATCH;
