# infra/auth

- Propósito: Adaptadores de autenticación (PASETO) y providers que implementan contratos de la capa de aplicación.
- Archivos críticos: `PasetoService.ts` (sign/verify tokens), integraciones a TokenProvider.
- No debería ir aquí: controladores o casos de uso.
- Relación: consumido por AuthModule y guards para validar tokens.
- Integración frontend: define cómo se generan/verifican los tokens enviados en cookies (`infancias_access_token`, `infancias_refresh_token`).
