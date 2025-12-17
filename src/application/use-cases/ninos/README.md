# Use cases: Niños

Roles clave
- Responsable de aplicar reglas de negocio de niños antes de llegar a repositorios.
- Dependen de repositorios/domain services (p. ej. validaciones de estado) y devuelven DTOs aptos para la capa HTTP.

Casos
- ListNinosUseCase: pagina y filtra por periodo/organizacion/estado.
- CreateNinoUseCase: alta con validaciones de dominio y relaciones requeridas.
- GetNinoUseCase: lectura por id, incluye relaciones mínimas necesarias.
- UpdateNinoUseCase: actualiza datos, respeta reglas de estado y ownership.
- InhabilitarNinoUseCase: marca con motivo y fecha; guarda trazabilidad.
- RestaurarNinoUseCase: revierte inhabilitación si procede.
- AutoInhabilitarNinosUseCase: inhabilita en lote según criterios de periodo/organizacion/fecha.

Seguridad y flujos
- La capa HTTP aplica permisos por acción; los casos asumen que ya se validó el permiso.
- Mantener la coherencia de estados: registrar motivo y fechas cuando se altere habilitación.

Pruebas
- Priorizar tests de dominio para cambios en reglas de inhabilitación/restauración.
- Tests de integración deben cubrir filtros/paginación en listados.
