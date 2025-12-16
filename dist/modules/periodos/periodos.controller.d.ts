/**
 * # periodos.controller
 * Propósito: Endpoints HTTP de periodos.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import { type CreatePeriodoDTO, type UpdatePeriodoDTO } from '@/application/dtos/PeriodoDTOs';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';
import { GetPeriodoUseCase } from '@/application/use-cases/periodos/GetPeriodoUseCase';
import { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';
import { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
export declare class PeriodosController {
    private readonly listPeriodosUseCase;
    private readonly createPeriodoUseCase;
    private readonly updatePeriodoUseCase;
    private readonly openPeriodoUseCase;
    private readonly closePeriodoUseCase;
    private readonly activatePeriodoUseCase;
    private readonly getPeriodoUseCase;
    constructor(listPeriodosUseCase: ListPeriodosUseCase, createPeriodoUseCase: CreatePeriodoUseCase, updatePeriodoUseCase: UpdatePeriodoUseCase, openPeriodoUseCase: OpenPeriodoUseCase, closePeriodoUseCase: ClosePeriodoUseCase, activatePeriodoUseCase: ActivatePeriodoUseCase, getPeriodoUseCase: GetPeriodoUseCase);
    get(id: number): Promise<import("../../domain/entities").PeriodoProps>;
    list(estado?: string, activo?: boolean): Promise<import("../../domain/entities").PeriodoProps[]>;
    create(body: CreatePeriodoDTO): Promise<import("../../domain/entities").PeriodoProps>;
    update(id: number, body: UpdatePeriodoDTO): Promise<import("../../domain/entities").PeriodoProps>;
    open(id: number): Promise<import("../../domain/entities").PeriodoProps>;
    close(id: number): Promise<import("../../domain/entities").PeriodoProps>;
    activate(id: number): Promise<import("../../domain/entities").PeriodoProps>;
}
