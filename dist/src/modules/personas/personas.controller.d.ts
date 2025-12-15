/**
 * # personas.controller
 * Propósito: Endpoints HTTP de personas.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import { type CreatePersonaDTO, type UpdatePersonaDTO } from '@/application/dtos/PersonaDTOs';
import { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';
import { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';
import { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
export declare class PersonasController {
    private readonly listPersonasUseCase;
    private readonly createPersonaUseCase;
    private readonly getPersonaUseCase;
    private readonly updatePersonaUseCase;
    private readonly deletePersonaUseCase;
    constructor(listPersonasUseCase: ListPersonasUseCase, createPersonaUseCase: CreatePersonaUseCase, getPersonaUseCase: GetPersonaUseCase, updatePersonaUseCase: UpdatePersonaUseCase, deletePersonaUseCase: DeletePersonaUseCase);
    list(organizacionId?: string, search?: string): Promise<import("../../domain/entities").PersonaProps[]>;
    create(body: CreatePersonaDTO): Promise<import("../../domain/entities").PersonaProps>;
    findOne(id: number): Promise<import("../../domain/entities").PersonaProps>;
    update(id: number, body: UpdatePersonaDTO): Promise<import("../../domain/entities").PersonaProps>;
    delete(id: number, user: AuthenticatedUser): Promise<void>;
}
