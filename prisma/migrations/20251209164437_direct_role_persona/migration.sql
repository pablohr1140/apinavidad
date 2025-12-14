/* # migration | Propósito: Esquema/consulta migration | Pertenece a: Prisma | Interacciones: Base de datos */

/*
  Warnings:

  - You are about to drop the `persona_roles` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[personas] ADD [role_id] INT;

-- DropTable
DROP TABLE [dbo].[persona_roles];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
