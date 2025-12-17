# modules/reportes

- Propósito: Endpoints HTTP de reportes y exportes asíncronos (PDF/Excel) relacionados a niños.
- Archivos críticos: `reportes.controller.ts` (rutas), `report-export.service.ts` (cola simple, generación y TTL), `reportes.module.ts`.
- No debería ir aquí: lógica de dominio o casos de uso ajenos a reportes.
- Integración frontend: usar `POST /reportes/exports` para encolar, `GET /reportes/exports/:jobId` para estado y `GET /reportes/exports/:jobId/download` para descarga; requiere permisos `ninos.view` y cookies/CSRF.
