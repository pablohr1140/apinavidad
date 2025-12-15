"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
/**
 * # ReportingService
 * Propósito: Generar reportes PDF/Excel en el backend para descargas imprimibles y masivas.
 * Pertenece a: Infraestructura / Reporting.
 * Interacciones: pdfmake para PDF, ExcelJS para XLSX; se ejecuta en el servidor porque ~18k registros serían costosos en el frontend.
 *
 * Notas PDF (pdfmake):
 * - Construye documentos declarando un docDefinition (content, styles, header, footer, tables).
 * - Tablas: usar `table.body` con filas/columnas; se pueden agregar widths, layout y estilos.
 * - Cabeceras/pies: `header`/`footer` pueden ser strings o funciones que reciben página actual.
 * - Exportable: `printer.createPdfKitDocument(docDefinition)` y acumular buffers para devolver un `Buffer` descargable.
 *
 * Notas Excel (ExcelJS):
 * - Crear workbook: `const workbook = new ExcelJS.Workbook();`.
 * - Hojas: `const sheet = workbook.addWorksheet('Nombre');`.
 * - Datos masivos: `sheet.addRows(rowsArray);` (stream interno, evita loops manuales gigantes).
 * - Estilos: `sheet.getRow(1).font = { bold: true };`, widths con `sheet.columns`.
 * - Exportable: `await workbook.xlsx.writeBuffer()` produce un `Buffer` .xlsx listo para respuesta HTTP.
 *
 * Consideración crítica: todo se genera en el servidor para soportar ~18k registros sin bloquear el frontend.
 */
const exceljs_1 = __importDefault(require("exceljs"));
const pdfmake_1 = __importDefault(require("pdfmake"));
const vfs_fonts_1 = require("pdfmake/build/vfs_fonts");
// Fuentes mínimas para pdfmake; en servidores sin fuentes, Roboto debe proveerse.
const defaultFonts = {
    // pdfmake usa nombres lógicos; los archivos ttf viven dentro del vfs que cargamos abajo.
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf'
    }
};
class ReportingService {
    // Para personalizar el PDF: modifica header/footer, styles, widths y layout dentro de docDefinition.
    // Cambia columnas ajustando el shape de rows (orden de keys) en quien llama a buildPdf/buildExcel.
    // Para aplicar estilos específicos a columnas, edita styles o usa layout en table.
    async buildPdf(rows, title) {
        const body = this.buildTableBody(rows);
        const docDefinition = {
            info: { title },
            header: { text: title, alignment: 'center', margin: [0, 10, 0, 10] },
            footer: (currentPage, pageCount) => ({ text: `${currentPage} / ${pageCount}`, alignment: 'right', margin: [0, 10, 20, 0] }),
            content: [
                { text: title, style: 'title', margin: [0, 0, 0, 10] },
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        widths: body.length ? new Array(body[0].length).fill('*') : [],
                        body
                    }
                }
            ],
            styles: {
                title: { fontSize: 14, bold: true },
                tableExample: { margin: [0, 5, 0, 15] }
            }
        };
        const printer = new pdfmake_1.default(defaultFonts);
        // Carga el vfs embebido de pdfmake para disponer de las fuentes Roboto sin depender del filesystem.
        printer.vfs = vfs_fonts_1.vfs;
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        return await new Promise((resolve, reject) => {
            pdfDoc.on('data', (chunk) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });
    }
    // Para personalizar el Excel: edita headers/orden en quien consume este servicio y ajusta estilos aquí.
    // Ejemplos: sheet.getRow(1).font, sheet.columns widths, o aplicar formatos numéricos con numFmt.
    async buildExcel(rows, title) {
        const workbook = new exceljs_1.default.Workbook();
        workbook.creator = 'api-reporting';
        const sheet = workbook.addWorksheet(title.slice(0, 31) || 'Reporte');
        if (rows.length === 0) {
            sheet.addRow(['Sin datos']);
            const excelBuffer = await workbook.xlsx.writeBuffer();
            return Buffer.isBuffer(excelBuffer) ? excelBuffer : Buffer.from(excelBuffer);
        }
        const headers = Object.keys(rows[0]);
        sheet.addRow(headers);
        sheet.getRow(1).font = { bold: true };
        const data = rows.map((row) => headers.map((key) => row[key]));
        sheet.addRows(data);
        sheet.columns?.forEach((col) => {
            col.width = Math.min(30, Math.max(12, col.header?.toString().length ?? 12));
        });
        const excelBuffer = await workbook.xlsx.writeBuffer();
        return Buffer.isBuffer(excelBuffer) ? excelBuffer : Buffer.from(excelBuffer);
    }
    buildTableBody(rows) {
        if (rows.length === 0)
            return [['Sin datos']];
        const headers = Object.keys(rows[0]);
        const dataRows = rows.map((row) => headers.map((key) => this.normalizeCell(row[key])));
        return [headers, ...dataRows];
    }
    normalizeCell(value) {
        if (value instanceof Date)
            return value.toISOString();
        if (typeof value === 'boolean')
            return value ? 'true' : 'false';
        if (value === null || value === undefined)
            return '';
        if (Array.isArray(value) || typeof value === 'object')
            return JSON.stringify(value);
        return value;
    }
}
exports.ReportingService = ReportingService;
