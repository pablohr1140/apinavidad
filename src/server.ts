/**
 * server.ts
 * Capa: Bootstrap / Compatibilidad
 * Responsabilidad: Mantener el entrypoint legacy para imports antiguos; el arranque real vive en `main.ts`.
 * Interacciones: No inicia servidor ni registra middlewares; sirve solo para no romper referencias previas.
 * Notas: Evitar agregar lógica aquí para prevenir arranques duplicados; conservar hasta eliminar dependencias externas.
 */
export {};
