<!-- # README | Propósito: Dominio README | Pertenece a: Dominio | Interacciones: Entidades, reglas de negocio -->

# Carpeta domain/

Propósito: contener entidades, tipos y servicios de dominio (reglas de negocio puras, sin dependencias de infraestructura).

Contenido típico:
- Entidades y tipos (ej. estados, props de personas/organizaciones/ninos).
- Servicios de dominio (reglas como cálculo de edad, auto-inhabilitación).

Relaciones:
- Consumido por casos de uso en `application/use-cases`.
- No depende de infraestructura; sólo de tipos y lógica pura.
