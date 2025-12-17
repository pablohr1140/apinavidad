# Use cases: Organizaciones

Rol
- Orquestan reglas de negocio para organizaciones antes de tocar repositorios/servicios externos.
- Devuelven DTOs aptos para HTTP; no manejan detalles de transporte.

Casos
- ListOrganizacionesUseCase: filtros por estado/tipo; paginación definida en repositorio.
- CreateOrganizacionUseCase: alta básica con validación de datos obligatorios.
- CreateOrganizacionConProvidenciaUseCase: crea organización junto con providencia asociada.
- GetOrganizacionUseCase: lectura por id con consistencia de relaciones requeridas.
- UpdateOrganizacionUseCase: actualiza datos cuidando estados transitorios.
- DeleteOrganizacionUseCase: elimina o deshabilita según reglas del repositorio (soft/hard configurable ahí).

Seguridad y flujos
- Permisos se validan en el controller; los use cases asumen que el caller ya está autorizado.
- Si se introducen estados adicionales, alinear filtros de listado y validaciones de actualización.

Pruebas
- Agregar pruebas de regresión cuando cambien reglas de estado o creación con providencia.
- Tests de integración deben cubrir filtros combinados estado/tipo.
