/**
 * ReportingService
 * Capa: Infraestructura / Reporting
 * Responsabilidad: Construir buffers PDF (pdfmake) y Excel (exceljs) a partir de filas ya preparadas.
 * Dependencias: pdfmake, exceljs.
 * Flujo: buildPdf/buildExcel -> formatea headers/rows -> devuelve Buffer listo para envío HTTP/archivo.
 * Endpoints/servicios impactados: ReportesController (descargas síncronas) y ReportExportService (export async).
 * Frontend: recibe archivos binarios desde los endpoints de reportes/exportes.
 */
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import type { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

// Usa las fuentes estándar de PDFKit para evitar depender del filesystem.
const defaultFonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
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
      pageOrientation: 'landscape',
      header: { text: title, alignment: 'center', margin: [0, 10, 0, 10] },
      footer: (currentPage: number, pageCount: number) => ({ text: `${currentPage} / ${pageCount}`, alignment: 'right', margin: [0, 10, 20, 0] }),
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
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Buffer[] = [];
    return await new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk as Buffer));
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

    sheet.columns?.forEach((col: Partial<ExcelJS.Column>) => {
      const header = col.header as string | number | undefined;
      col.width = Math.min(30, Math.max(12, header?.toString().length ?? 12));
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
