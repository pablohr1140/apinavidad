# infra/database

- Propósito: Acceso a datos vía Prisma (SQL Server) y configuración de PrismaClient.
- Archivos críticos: `prisma.service.ts`, repositorios Prisma bajo `repositories/`.
- No debería ir aquí: lógica de dominio o controladores.
- Relación: implementa contratos de repositorio de la capa de aplicación.
- Integración frontend: indirecta; afecta tiempos de respuesta y paginación (`skip/take`).
