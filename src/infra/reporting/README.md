# infra/reporting

- Propósito: Generación de reportes PDF/Excel en backend (pdfmake, exceljs).
- Archivos críticos: `reporting.service.ts` (buildPdf/buildExcel).
- No debería ir aquí: controladores o lógica de dominio.
- Relación: usado por casos/controladores de reportes y servicios de exportación.
- Integración frontend: define el formato de archivos que se descargan desde endpoints de reportes/exportes.
