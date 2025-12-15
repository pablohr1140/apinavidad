export interface ReportRow {
    [key: string]: string | number | boolean | Date | null | undefined;
}
export declare class ReportingService {
    buildPdf(rows: ReportRow[], title: string): Promise<Buffer>;
    buildExcel(rows: ReportRow[], title: string): Promise<Buffer>;
    private buildTableBody;
    private normalizeCell;
}
