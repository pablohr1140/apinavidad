<!-- # README | Propósito: Archivo README | Pertenece a: General | Interacciones: N/A -->

# Carpeta application/

Propósito: orquestar lógica de aplicación (casos de uso) y definir contratos de repositorios/servicios que implementa la infraestructura.

Subcarpetas:
- `contracts/`: contratos de servicios/ports adicionales.
- `dtos/`: DTOs para entrada/salida de casos de uso y controladores.
- `repositories/`: interfaces de repositorio (OrganizacionRepository, PersonaRepository, etc.).
- `use-cases/`: casos de uso que coordinan dominio y persistencia.

Relaciones:
- Depende de `domain/` para entidades y reglas.
- Consumido por `modules/` (controladores) e implementado por `infra/` (repositorios, servicios concretos).
