/**
 * # organizaciones.controller
 * Propósito: Endpoints HTTP de organizaciones.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */
import { type CreateOrganizacionDTO, type CreateOrganizacionConProvidenciaDTO, type UpdateOrganizacionDTO } from '@/application/dtos/OrganizacionDTOs';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import { CreateOrganizacionConProvidenciaUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionConProvidenciaUseCase';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
export declare class OrganizacionesController {
    private readonly listOrganizacionesUseCase;
    private readonly createOrganizacionUseCase;
    private readonly createOrganizacionConProvidenciaUseCase;
    private readonly getOrganizacionUseCase;
    private readonly updateOrganizacionUseCase;
    private readonly deleteOrganizacionUseCase;
    constructor(listOrganizacionesUseCase: ListOrganizacionesUseCase, createOrganizacionUseCase: CreateOrganizacionUseCase, createOrganizacionConProvidenciaUseCase: CreateOrganizacionConProvidenciaUseCase, getOrganizacionUseCase: GetOrganizacionUseCase, updateOrganizacionUseCase: UpdateOrganizacionUseCase, deleteOrganizacionUseCase: DeleteOrganizacionUseCase);
    list(estado?: string, tipo?: string): Promise<import("../../domain/entities").OrganizacionProps[]>;
    create(body: CreateOrganizacionDTO): Promise<import("../../domain/entities").OrganizacionProps>;
    createWithProvidencia(body: CreateOrganizacionConProvidenciaDTO): Promise<{
        id: number;
        nombre: string;
        tipo: string;
        direccion: string | undefined;
        telefono: string | undefined;
        email: string | undefined;
        providenciaId: number | undefined;
        sectorId: number | undefined;
        estado: string;
        createdAt: Date;
        updatedAt: Date;
        providencia: {
            id: number;
            nombre: string;
            codigo: string | undefined;
            activo: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getOne(id: number): Promise<import("../../domain/entities").OrganizacionProps>;
    update(id: number, body: UpdateOrganizacionDTO): Promise<import("../../domain/entities").OrganizacionProps>;
    delete(id: number): Promise<void>;
}
