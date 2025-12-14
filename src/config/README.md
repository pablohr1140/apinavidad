<!-- # README | Propósito: Config README | Pertenece a: Configuración | Interacciones: Variables de entorno, bootstrap -->

# Carpeta config/

Propósito: configuración de entorno, auth/cookies y alias de módulos.

Archivos:
- `env.ts`: valida `process.env` con Zod y expone `env` tipado.
- `auth.ts`: TTL y opciones de cookies para tokens PASETO (access/refresh).
- `module-alias.ts`: registra alias `@` hacia `src` o `dist` según build.
