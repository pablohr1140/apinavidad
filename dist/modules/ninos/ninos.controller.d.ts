/**
 * # ninos.controller
 * Propósito: Endpoints HTTP de ninos.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import { type CreateNinoDTO, type UpdateNinoDTO, type InhabilitarNinoDTO, type AutoInhabilitarNinosDTO } from '@/application/dtos/NinoDTOs';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
import { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
export declare class NinosController {
    private readonly listNinosUseCase;
    private readonly createNinoUseCase;
    private readonly getNinoUseCase;
    private readonly updateNinoUseCase;
    private readonly inhabilitarNinoUseCase;
    private readonly restaurarNinoUseCase;
    private readonly autoInhabilitarNinosUseCase;
    constructor(listNinosUseCase: ListNinosUseCase, createNinoUseCase: CreateNinoUseCase, getNinoUseCase: GetNinoUseCase, updateNinoUseCase: UpdateNinoUseCase, inhabilitarNinoUseCase: InhabilitarNinoUseCase, restaurarNinoUseCase: RestaurarNinoUseCase, autoInhabilitarNinosUseCase: AutoInhabilitarNinosUseCase);
    list(periodoId?: string, organizacionId?: string, estado?: string): Promise<import("@/domain/entities").NinoProps[]>;
    create(body: CreateNinoDTO): Promise<import("@/domain/entities").NinoProps>;
    findOne(id: number): Promise<import("@/domain/entities").NinoProps>;
    update(id: number, body: UpdateNinoDTO): Promise<import("@/domain/entities").NinoProps>;
    inhabilitar(id: number, body: InhabilitarNinoDTO): Promise<import("@/domain/entities").NinoProps>;
    restaurar(id: number): Promise<import("@/domain/entities").NinoProps>;
    autoInhabilitar(body: AutoInhabilitarNinosDTO): Promise<{
        afectados: number;
    } & {
        detalles?: import("@/domain/entities").NinoProps[];
    }>;
    private parseNumber;
    private parseBoolean;
    private parseEstado;
}
