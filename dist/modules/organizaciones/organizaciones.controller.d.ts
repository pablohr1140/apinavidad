import { type CreateOrganizacionDTO, type UpdateOrganizacionDTO } from '@/application/dtos/OrganizacionDTOs';
import { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
export declare class OrganizacionesController {
    private readonly listOrganizacionesUseCase;
    private readonly createOrganizacionUseCase;
    private readonly getOrganizacionUseCase;
    private readonly updateOrganizacionUseCase;
    private readonly deleteOrganizacionUseCase;
    constructor(listOrganizacionesUseCase: ListOrganizacionesUseCase, createOrganizacionUseCase: CreateOrganizacionUseCase, getOrganizacionUseCase: GetOrganizacionUseCase, updateOrganizacionUseCase: UpdateOrganizacionUseCase, deleteOrganizacionUseCase: DeleteOrganizacionUseCase);
    list(estado?: string, tipo?: string): Promise<import("../../domain/entities").OrganizacionProps[]>;
    create(body: CreateOrganizacionDTO): Promise<import("../../domain/entities").OrganizacionProps>;
    getOne(id: number): Promise<import("../../domain/entities").OrganizacionProps>;
    update(id: number, body: UpdateOrganizacionDTO): Promise<import("../../domain/entities").OrganizacionProps>;
    delete(id: number): Promise<void>;
}
