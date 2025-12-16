-- Reordena columnas de dbo.ninos según el orden solicitado
-- Orden final:
-- id | documento_numero | tipo_documento_id | nombres | apellidos | fecha_nacimiento | edad | sexo | nacionalidad_id | etnia_id | organizacion_id | periodo_id | persona_registro_id | tiene_discapacidad | es_prioritario | tiene_RSH | estado | fecha_ingreso | fecha_retiro | created_at | updated_at

SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRAN;

    -- 1) Soltar FK que referencia ninos desde discapacidad_nino (para poder renombrar tabla)
    IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_discapacidad_nino_ninos')
        ALTER TABLE dbo.discapacidad_nino DROP CONSTRAINT FK_discapacidad_nino_ninos;

    -- 2) Soltar FKs salientes de ninos
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

    -- 3) Crear tabla nueva con el orden deseado (nombres de constraints con sufijo _new para evitar colisiones)
    IF OBJECT_ID('dbo.ninos_new', 'U') IS NOT NULL DROP TABLE dbo.ninos_new;

    CREATE TABLE dbo.ninos_new (
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
        tiene_discapacidad  BIT NOT NULL CONSTRAINT DF_ninos_reord_tiene_discapacidad DEFAULT (0),
        es_prioritario      BIT NOT NULL CONSTRAINT DF_ninos_reord_es_prioritario DEFAULT (0),
        tiene_RSH           BIT NOT NULL CONSTRAINT DF_ninos_reord_tiene_RSH DEFAULT (0),
        estado              BIT NOT NULL CONSTRAINT DF_ninos_reord_estado_bit DEFAULT (1),
        fecha_ingreso       DATE NULL,
        fecha_retiro        DATE NULL,
        created_at          DATETIME2 NOT NULL CONSTRAINT DF_ninos_reord_created_at DEFAULT (sysdatetime()),
        updated_at          DATETIME2 NOT NULL CONSTRAINT DF_ninos_reord_updated_at DEFAULT (sysdatetime()),
        CONSTRAINT PK_ninos_reord PRIMARY KEY CLUSTERED (id)
    );

    -- 4) Copiar datos preservando IDs
    SET IDENTITY_INSERT dbo.ninos_new ON;
    INSERT INTO dbo.ninos_new (
        id, documento_numero, tipo_documento_id, nombres, apellidos, fecha_nacimiento, edad, sexo,
        nacionalidad_id, etnia_id, organizacion_id, periodo_id, persona_registro_id,
        tiene_discapacidad, es_prioritario, tiene_RSH, estado,
        fecha_ingreso, fecha_retiro, created_at, updated_at
    )
    SELECT
        id, documento_numero, tipo_documento_id, nombres, apellidos, fecha_nacimiento, edad, sexo,
        nacionalidad_id, etnia_id, organizacion_id, periodo_id, persona_registro_id,
        tiene_discapacidad, es_prioritario, tiene_RSH, estado,
        fecha_ingreso, fecha_retiro, created_at, updated_at
    FROM dbo.ninos;
    SET IDENTITY_INSERT dbo.ninos_new OFF;

    -- 5) Eliminar tabla antigua
    DROP TABLE dbo.ninos;

    -- 6) Renombrar tabla nueva
    EXEC sp_rename 'dbo.ninos_new', 'ninos';

    -- 7) Renombrar constraints a nombres canónicos
    EXEC sp_rename 'DF_ninos_reord_tiene_discapacidad', 'DF_ninos_tiene_discapacidad', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reord_es_prioritario', 'DF_ninos_es_prioritario', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reord_tiene_RSH', 'DF_ninos_tiene_RSH', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reord_estado_bit', 'DF_ninos_estado_bit', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reord_created_at', 'DF_ninos_created_at', 'OBJECT';
    EXEC sp_rename 'DF_ninos_reord_updated_at', 'DF_ninos_updated_at', 'OBJECT';
    EXEC sp_rename 'PK_ninos_reord', 'PK_ninos';

    -- 8) Índices y constraints únicos
    CREATE UNIQUE INDEX UQ_ninos_doc_tipo_numero ON dbo.ninos (tipo_documento_id, documento_numero);
    CREATE INDEX IX_ninos_estado_periodo ON dbo.ninos (estado, periodo_id);
    CREATE INDEX IX_ninos_etnia_id ON dbo.ninos (etnia_id);

    -- 9) Restaurar FKs salientes de ninos
    UPDATE n SET persona_registro_id = NULL
    FROM dbo.ninos AS n
    LEFT JOIN dbo.personas p ON n.persona_registro_id = p.id
    WHERE n.persona_registro_id IS NOT NULL AND p.id IS NULL;

    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_organizaciones FOREIGN KEY (organizacion_id) REFERENCES dbo.organizaciones (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_periodos FOREIGN KEY (periodo_id) REFERENCES dbo.periodos (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_tipo_documentos FOREIGN KEY (tipo_documento_id) REFERENCES dbo.tipo_documentos (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_nacionalidades FOREIGN KEY (nacionalidad_id) REFERENCES dbo.nacionalidades (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_etnias FOREIGN KEY (etnia_id) REFERENCES dbo.etnias (id) ON UPDATE NO ACTION;
    ALTER TABLE dbo.ninos WITH CHECK ADD CONSTRAINT FK_ninos_personas_registro FOREIGN KEY (persona_registro_id) REFERENCES dbo.personas (id) ON UPDATE NO ACTION;

    -- 10) Restaurar FK entrante desde discapacidad_nino
    ALTER TABLE dbo.discapacidad_nino WITH CHECK ADD CONSTRAINT FK_discapacidad_nino_ninos FOREIGN KEY (nino_id) REFERENCES dbo.ninos (id) ON DELETE CASCADE ON UPDATE NO ACTION;

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
END CATCH;
