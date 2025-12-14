import { type CreatePeriodoDTO, type UpdatePeriodoDTO } from '@/application/dtos/PeriodoDTOs';
import { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';
import { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';
import { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
import { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
export declare class PeriodosController {
    private readonly listPeriodosUseCase;
    private readonly createPeriodoUseCase;
    private readonly updatePeriodoUseCase;
    private readonly openPeriodoUseCase;
    private readonly closePeriodoUseCase;
    private readonly activatePeriodoUseCase;
    constructor(listPeriodosUseCase: ListPeriodosUseCase, createPeriodoUseCase: CreatePeriodoUseCase, updatePeriodoUseCase: UpdatePeriodoUseCase, openPeriodoUseCase: OpenPeriodoUseCase, closePeriodoUseCase: ClosePeriodoUseCase, activatePeriodoUseCase: ActivatePeriodoUseCase);
    list(estado?: string, activo?: boolean): Promise<import("../../domain/entities").PeriodoProps[]>;
    create(body: CreatePeriodoDTO): Promise<import("../../domain/entities").PeriodoProps>;
    update(id: number, body: UpdatePeriodoDTO): Promise<import("../../domain/entities").PeriodoProps>;
    open(id: number): Promise<import("../../domain/entities").PeriodoProps>;
    close(id: number): Promise<import("../../domain/entities").PeriodoProps>;
    activate(id: number): Promise<import("../../domain/entities").PeriodoProps>;
}
