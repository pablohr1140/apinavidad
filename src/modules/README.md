<!-- # README | Propósito: Elemento de módulo README | Pertenece a: Módulo Nest | Interacciones: NestJS providers/controllers -->

# Carpeta modules/

Propósito: agrupar módulos NestJS por feature (auth, personas, organizaciones, ninos, periodos, reportes, logs).

Cada módulo suele incluir:
- Controladores HTTP.
- Providers (casos de uso, servicios, repositorios inyectados).
- Configuración de guards/decorators específicos del feature.

Relaciones:
- Orquestados por `app.module.ts`.
- Dependencias hacia casos de uso en `application/use-cases` e implementaciones en `infra/`.
