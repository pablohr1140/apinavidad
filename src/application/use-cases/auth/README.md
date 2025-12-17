# application/use-cases/auth

- Propósito: Casos de uso de autenticación (login, refresh) y auxiliares.
- Archivos críticos: `LoginUseCase.ts`, `RefreshTokenUseCase.ts`.
- Responsabilidad: validar credenciales, emitir tokens PASETO, rotar refresh tokens y persistir sesiones en Redis.
- No debería ir aquí: controladores HTTP, acceso directo a Prisma o Redis sin pasar por contratos.
- Integración frontend: revisar cada UseCase para conocer payloads esperados, cookies emitidas y errores que pueden devolverse a los endpoints `/auth/*`.
