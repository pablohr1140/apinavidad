# application/use-cases

- Propósito: Casos de uso de la capa de aplicación. Orquestan lógica de dominio y coordinan repositorios/adaptadores.
- Contenido típico: clases `*UseCase` para auth, niños, reportes, etc.
- No debería ir aquí: lógica de infraestructura (DB, Redis, HTTP) ni definiciones de dominio puro.
- Integración frontend (lectura rápida): Los controladores exponen el contrato; los use cases documentan validaciones y side-effects (DB, Redis, archivos). Útil para saber qué errores o reglas pueden devolver los endpoints.

Guía de referencia
- Auth: Login/Refresh usan use cases que generan PASETO y sesiones en Redis.
- Reportes: Listados y exportes consumen `ListNinosUseCase`; export async usa `ReportExportService` (infra) pero el dataset viene de aquí.
- Niños/Organizaciones/Personas/Periodos: Cada acción de controller mapea 1:1 a un use case con validaciones Zod/negocio.
