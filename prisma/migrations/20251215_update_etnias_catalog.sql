-- Actualiza catálogo de etnias con el orden solicitado
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRAN;

    SET IDENTITY_INSERT dbo.etnias ON;

    MERGE dbo.etnias AS target
    USING (VALUES
        (1,  N'Mapuche',              N'MAP', N'Pueblo Mapuche'),
        (2,  N'Rapa Nui',             N'RPN', N'Pueblo Rapa Nui'),
        (3,  N'Atacameño (Lickanantay)', N'ATC', N'Pueblo Atacameño (Lickanantay)'),
        (4,  N'Quechua',              N'QUE', N'Pueblo Quechua'),
        (5,  N'Colla',                N'COL', N'Pueblo Colla'),
        (6,  N'Diaguita',             N'DIA', N'Pueblo Diaguita'),
        (7,  N'Kawésqar',             N'KAW', N'Pueblo Kawésqar'),
        (8,  N'Yagán (Yámana)',       N'YAG', N'Pueblo Yagán (Yámana)'),
        (9,  N'Chango',               N'CHA', N'Pueblo Chango'),
        (10, N'Selk''nam (Ona)',      N'SEL', N'Pueblo Selk''nam (Ona)'),
        (11, N'Aymara',               N'AYM', N'Pueblo Aymara')
    ) AS src(id, nombre, codigo, descripcion)
    ON target.id = src.id
    WHEN MATCHED THEN
        UPDATE SET nombre = src.nombre, codigo = src.codigo, descripcion = src.descripcion, activo = 1, updated_at = sysdatetime()
    WHEN NOT MATCHED THEN
        INSERT (id, nombre, codigo, descripcion, activo, created_at, updated_at)
        VALUES (src.id, src.nombre, src.codigo, src.descripcion, 1, sysdatetime(), sysdatetime());

    SET IDENTITY_INSERT dbo.etnias OFF;

    COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
END CATCH;
