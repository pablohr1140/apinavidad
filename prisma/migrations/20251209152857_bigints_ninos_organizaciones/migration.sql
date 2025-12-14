/* # migration | Propósito: Esquema/consulta migration | Pertenece a: Prisma | Interacciones: Base de datos */

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[discapacidad_nino] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nino_id] BIGINT NOT NULL,
    [discapacidad_id] INT NOT NULL,
    [porcentaje] TINYINT,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_discapacidad_nino_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_discapacidad_nino_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_discapacidad_nino] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_discapacidad_nino_pair] UNIQUE NONCLUSTERED ([nino_id],[discapacidad_id])
);

-- CreateTable
CREATE TABLE [dbo].[discapacidades] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(255) NOT NULL,
    [categoria] NVARCHAR(150),
    [codigo] NVARCHAR(20),
    [descripcion] NVARCHAR(max),
    [activo] BIT NOT NULL CONSTRAINT [DF_discapacidades_activo] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_discapacidades_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_discapacidades_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_discapacidades] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_discapacidades_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[etnias] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(255) NOT NULL,
    [codigo] NVARCHAR(10),
    [descripcion] NVARCHAR(500),
    [activo] BIT NOT NULL CONSTRAINT [DF_etnias_activo] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_etnias_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_etnias_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_etnias] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_etnias_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[logs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT,
    [accion] NVARCHAR(150) NOT NULL,
    [mensaje] NVARCHAR(max),
    [loggable_type] NVARCHAR(150) NOT NULL,
    [loggable_id] BIGINT NOT NULL,
    [payload] NVARCHAR(max),
    [ip] NVARCHAR(100),
    [user_agent] NVARCHAR(300),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_logs_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_logs_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_logs] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[migrations] (
    [id] INT NOT NULL IDENTITY(1,1),
    [timestamp] BIGINT NOT NULL,
    [name] VARCHAR(255) NOT NULL,
    CONSTRAINT [PK_8c82d7f526340ab734260ea46be] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[nacionalidades] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(255) NOT NULL,
    [iso] NVARCHAR(3),
    [gentilicio] NVARCHAR(120),
    [activo] BIT NOT NULL CONSTRAINT [DF_nacionalidades_activo] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_nacionalidades_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_nacionalidades_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_nacionalidades] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_nacionalidades_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[ninos] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [nombres] NVARCHAR(200) NOT NULL,
    [apellidos] NVARCHAR(200),
    [run] NVARCHAR(12),
    [dv] NVARCHAR(2),
    [documento] NVARCHAR(32),
    [fecha_nacimiento] DATE,
    [sexo] NVARCHAR(1),
    [organizacion_id] BIGINT,
    [periodo_id] INT NOT NULL,
    [providencia_id] INT,
    [es_prioritario] BIT NOT NULL CONSTRAINT [ninos_es_prioritario_df] DEFAULT 0,
    [edad] TINYINT,
    [tiene_discapacidad] BIT NOT NULL CONSTRAINT [DF_ninos_tiene_discapacidad] DEFAULT 0,
    [fecha_ingreso] DATE,
    [fecha_retiro] DATE,
    [estado] NVARCHAR(50) NOT NULL CONSTRAINT [DF_ninos_estado] DEFAULT 'registrado',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_ninos_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_ninos_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_ninos] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[organizacion_periodo] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organizacion_id] BIGINT NOT NULL,
    [periodo_id] INT NOT NULL,
    [estado] NVARCHAR(50) NOT NULL CONSTRAINT [DF_organizacion_periodo_estado] DEFAULT 'pendiente',
    [fecha_asignacion] DATE,
    [fecha_cierre] DATE,
    [observaciones] NVARCHAR(max),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizacion_periodo_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizacion_periodo_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_organizacion_periodo] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_organizacion_periodo_pair] UNIQUE NONCLUSTERED ([organizacion_id],[periodo_id])
);

-- CreateTable
CREATE TABLE [dbo].[organizacion_persona] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organizacion_id] BIGINT NOT NULL,
    [persona_id] INT NOT NULL,
    [es_principal] BIT NOT NULL CONSTRAINT [DF_organizacion_persona_es_principal] DEFAULT 0,
    [es_reserva] BIT NOT NULL CONSTRAINT [DF_organizacion_persona_es_reserva] DEFAULT 0,
    [activo] BIT NOT NULL CONSTRAINT [DF_organizacion_persona_activo] DEFAULT 1,
    [fecha_asignacion] DATE,
    [fecha_desactivacion] DATE,
    [observaciones] NVARCHAR(max),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizacion_persona_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizacion_persona_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_organizacion_persona] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_organizacion_persona_pair] UNIQUE NONCLUSTERED ([organizacion_id],[persona_id])
);

-- CreateTable
CREATE TABLE [dbo].[organizaciones] (
    [id] BIGINT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(250) NOT NULL,
    [sigla] NVARCHAR(50),
    [rut] NVARCHAR(12),
    [tipo] NVARCHAR(100) NOT NULL CONSTRAINT [DF_organizaciones_tipo] DEFAULT 'otro',
    [direccion] NVARCHAR(300),
    [telefono] NVARCHAR(20),
    [email] NVARCHAR(320),
    [providencia_id] INT,
    [estado] NVARCHAR(50) NOT NULL CONSTRAINT [DF_organizaciones_estado] DEFAULT 'borrador',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizaciones_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_organizaciones_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_organizaciones] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_organizaciones_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[periodos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(200) NOT NULL,
    [fecha_inicio] DATE,
    [fecha_fin] DATE,
    [estado_periodo] NVARCHAR(50) NOT NULL CONSTRAINT [DF_periodos_estado_periodo] DEFAULT 'borrador',
    [es_activo] BIT NOT NULL CONSTRAINT [DF_periodos_es_activo] DEFAULT 0,
    [descripcion] NVARCHAR(max),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_periodos_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_periodos_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_periodos] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_periodos_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[permissions] (
    [id] INT NOT NULL IDENTITY(1,1),
    [resource] NVARCHAR(50) NOT NULL,
    [action] NVARCHAR(50) NOT NULL,
    [description] NVARCHAR(255),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_permissions_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_permissions_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_permissions] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_permissions_resource_action] UNIQUE NONCLUSTERED ([resource],[action])
);

-- CreateTable
CREATE TABLE [dbo].[persona_roles] (
    [persona_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    CONSTRAINT [PK_persona_roles] PRIMARY KEY CLUSTERED ([persona_id],[role_id])
);

-- CreateTable
CREATE TABLE [dbo].[personas] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombres] NVARCHAR(200) NOT NULL,
    [apellidos] NVARCHAR(200) NOT NULL,
    [run] NVARCHAR(12),
    [documento] NVARCHAR(32),
    [dv] NVARCHAR(2),
    [fecha_nacimiento] DATE,
    [sexo] NVARCHAR(1),
    [telefono] NVARCHAR(20),
    [email] NVARCHAR(320),
    [email_verified_at] DATETIME2,
    [password] NVARCHAR(255),
    [remember_token] NVARCHAR(100),
    [direccion] NVARCHAR(300),
    [providencia_id] INT,
    [es_representante] BIT NOT NULL CONSTRAINT [DF_personas_es_representante] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_personas_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_personas_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_personas] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[providencias] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(255) NOT NULL,
    [codigo] NVARCHAR(10),
    [region] NVARCHAR(150),
    [comuna] NVARCHAR(150),
    [descripcion] NVARCHAR(max),
    [activo] BIT NOT NULL CONSTRAINT [DF_providencias_activo] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_providencias_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_providencias_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_providencias] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_providencias_nombre] UNIQUE NONCLUSTERED ([nombre])
);

-- CreateTable
CREATE TABLE [dbo].[role_permissions] (
    [role_id] INT NOT NULL,
    [permission_id] INT NOT NULL,
    CONSTRAINT [PK_role_permissions] PRIMARY KEY CLUSTERED ([role_id],[permission_id])
);

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [id] INT NOT NULL IDENTITY(1,1),
    [role_key] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(120) NOT NULL,
    [description] NVARCHAR(255),
    [rank] INT NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_roles_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_roles_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_roles] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_roles_key] UNIQUE NONCLUSTERED ([role_key])
);

-- CreateTable
CREATE TABLE [dbo].[tipo_documentos] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(255) NOT NULL,
    [codigo] NVARCHAR(10) NOT NULL,
    [descripcion] NVARCHAR(500),
    [activo] BIT NOT NULL CONSTRAINT [DF_tipo_documentos_activo] DEFAULT 1,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [DF_tipo_documentos_created_at] DEFAULT sysdatetime(),
    [updated_at] DATETIME2 NOT NULL CONSTRAINT [DF_tipo_documentos_updated_at] DEFAULT sysdatetime(),
    CONSTRAINT [PK_tipo_documentos] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_tipo_documentos_nombre] UNIQUE NONCLUSTERED ([nombre]),
    CONSTRAINT [UQ_tipo_documentos_codigo] UNIQUE NONCLUSTERED ([codigo])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_logs_accion] ON [dbo].[logs]([accion]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_logs_loggable] ON [dbo].[logs]([loggable_type], [loggable_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_ninos_estado_periodo] ON [dbo].[ninos]([estado], [periodo_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_organizacion_persona_principal] ON [dbo].[organizacion_persona]([organizacion_id], [es_principal]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_organizaciones_estado] ON [dbo].[organizaciones]([estado]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_personas_nombres_apellidos] ON [dbo].[personas]([nombres], [apellidos]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
