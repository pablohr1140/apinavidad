/**
 * # reportes.controller
 * Propósito: Endpoints HTTP de reportes.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import type { Response } from 'express';
import { ListadoReportesQueryDto } from '@/application/dtos/ReporteDTOs';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import type { EstadoNino } from '@/domain/entities';
import { ReportingService } from '@/infra/reporting/reporting.service';
export declare class ReportesController {
    private readonly listNinosUseCase;
    private readonly reportingService;
    private readonly logger;
    constructor(listNinosUseCase: ListNinosUseCase, reportingService: ReportingService);
    listInhabilitados(): Promise<{
        total: number;
        data: import("@/domain/entities").NinoProps[];
    }>;
    listado(query: ListadoReportesQueryDto): Promise<{
        total: number;
        data: {
            edad_calculada: number | null;
            tiempo_para_inhabilitar: number | null;
            id: number;
            nombres: string;
            apellidos?: string | null;
            documento_numero: string;
            tipoDocumentoId?: number | null;
            nacionalidadId?: number | null;
            etniaId?: number | null;
            personaRegistroId?: number | null;
            fecha_nacimiento?: Date | null;
            sexo?: string | null;
            organizacionId?: number | null;
            periodoId: number;
            edad?: number | null;
            tiene_discapacidad: boolean;
            tiene_RSH: boolean;
            fecha_ingreso?: Date | null;
            fecha_retiro?: Date | null;
            estado: EstadoNino;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    listadoPdf(query: ListadoReportesQueryDto, res: Response): Promise<void>;
    listadoExcel(query: ListadoReportesQueryDto, res: Response): Promise<void>;
    private buildNinosData;
    private parseEstado;
}
