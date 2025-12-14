import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
export declare class ReportesController {
    private readonly listNinosUseCase;
    constructor(listNinosUseCase: ListNinosUseCase);
    listInhabilitados(): Promise<{
        total: number;
        data: import("../../domain/entities").NinoProps[];
    }>;
    listado(periodoId?: string, organizacionId?: string, estado?: string): Promise<{
        total: number;
        data: {
            edad_calculada: number | null;
            tiempo_para_inhabilitar: number | null;
            id: number;
            nombres: string;
            apellidos?: string | null;
            run?: string | null;
            dv?: string | null;
            documento?: string | null;
            fecha_nacimiento?: Date | null;
            sexo?: string | null;
            organizacionId?: number | null;
            periodoId: number;
            providenciaId?: number | null;
            edad?: number | null;
            tiene_discapacidad: boolean;
            fecha_ingreso?: Date | null;
            fecha_retiro?: Date | null;
            estado: import("../../domain/entities").EstadoNino;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    private toNumber;
}
