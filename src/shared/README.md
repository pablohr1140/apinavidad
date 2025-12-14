<!-- # README | Propósito: Utilidades compartidas README | Pertenece a: Compartido | Interacciones: Helpers reutilizables -->

# Carpeta shared/

Propósito: utilidades transversales usadas en múltiples capas (logger, flags de Prisma, errores comunes).

Ejemplos:
- `logger.ts`: configuración de logging.
- `prisma-flags.ts`: helpers para estado de feature flags Prisma.
- `errors/`: clases de error compartidas.

Relaciones:
- Consumido por `infra/`, `application/` y `modules/`.
