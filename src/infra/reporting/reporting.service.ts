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
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import { vfs as pdfmakeVfs } from 'pdfmake/build/vfs_fonts';
import type { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

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

export interface ReportRow {
  [key: string]: string | number | boolean | Date | null | undefined;
}

export class ReportingService {
  // Para personalizar el PDF: modifica header/footer, styles, widths y layout dentro de docDefinition.
  // Cambia columnas ajustando el shape de rows (orden de keys) en quien llama a buildPdf/buildExcel.
  // Para aplicar estilos específicos a columnas, edita styles o usa layout en table.
  async buildPdf(rows: ReportRow[], title: string): Promise<Buffer> {
    const body = this.buildTableBody(rows);

    const docDefinition: TDocumentDefinitions = {
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

    const printer = new PdfPrinter(defaultFonts as any);
    // Carga el vfs embebido de pdfmake para disponer de las fuentes Roboto sin depender del filesystem.
    (printer as any).vfs = pdfmakeVfs;
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Buffer[] = [];
    return await new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk) => chunks.push(chunk as Buffer));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }

  // Para personalizar el Excel: edita headers/orden en quien consume este servicio y ajusta estilos aquí.
  // Ejemplos: sheet.getRow(1).font, sheet.columns widths, o aplicar formatos numéricos con numFmt.
  async buildExcel(rows: ReportRow[], title: string): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
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

  private buildTableBody(rows: ReportRow[]): TableCell[][] {
    if (rows.length === 0) return [['Sin datos']];
    const headers = Object.keys(rows[0]);
    const dataRows = rows.map((row) => headers.map((key) => this.normalizeCell(row[key])));
    return [headers, ...dataRows];
  }

  private normalizeCell(value: unknown): TableCell {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value);
    return value as TableCell;
  }
}
