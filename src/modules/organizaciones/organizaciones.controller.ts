/**
 * OrganizacionesController
 * Capa: HTTP
 * Responsabilidad: CRUD de organizaciones y alta con providencia; valida DTOs y orquesta casos de uso.
 * Seguridad actual: guardias globales + `@Permissions` (view/create/update/delete). Sin endpoints públicos.
 * Endpoints y contratos:
 *  - GET /organizaciones: Query { estado?, tipo? } -> resp lista filtrada.
 *  - POST /organizaciones: Body CreateOrganizacionDTO -> resp organización creada.
 *  - POST /organizaciones/con-providencia: Body CreateOrganizacionConProvidenciaDTO -> crea organización + providencia.
 *  - GET /organizaciones/:id: Param id -> resp detalle.
 *  - PUT /organizaciones/:id: Body UpdateOrganizacionDTO -> resp organización actualizada.
 *  - DELETE /organizaciones/:id: sin body, 204 No Content.
 * Headers/cookies: requiere cookies de auth; `X-CSRF-Token` en POST/PUT/DELETE; Authorization Bearer opcional.
 * Ejemplo de integración frontend (descriptivo): listar con filtros simples; crear enviando DTO; para delete enviar DELETE con CSRF y cookies, esperar 204.
 */
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import {
  createOrganizacionSchema,
  createOrganizacionConProvidenciaSchema,
  updateOrganizacionSchema,
  type CreateOrganizacionDTO,
  type CreateOrganizacionConProvidenciaDTO,
  type UpdateOrganizacionDTO
} from '@/application/dtos/OrganizacionDTOs';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import { CreateOrganizacionConProvidenciaUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionConProvidenciaUseCase';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';

@Controller('organizaciones')
export class OrganizacionesController {
  constructor(
    private readonly listOrganizacionesUseCase: ListOrganizacionesUseCase,
    private readonly createOrganizacionUseCase: CreateOrganizacionUseCase,
    private readonly createOrganizacionConProvidenciaUseCase: CreateOrganizacionConProvidenciaUseCase,
    private readonly getOrganizacionUseCase: GetOrganizacionUseCase,
    private readonly updateOrganizacionUseCase: UpdateOrganizacionUseCase,
    private readonly deleteOrganizacionUseCase: DeleteOrganizacionUseCase
  ) {}

  @Permissions('organizaciones.view')
  @Get()
  list(@Query('estado') estado?: string, @Query('tipo') tipo?: string) {
    const cleanEstado = estado?.trim() || undefined;
    const cleanTipo = tipo?.trim() || undefined;
    try {
      return this.listOrganizacionesUseCase.execute({ estado: cleanEstado, tipo: cleanTipo });
    } catch (error) {
      console.error('OrganizacionesController.list error', { estado: cleanEstado, tipo: cleanTipo, error });
      throw error;
    }
  }

  @Permissions('organizaciones.create')
  @Post()
  create(@Body(new ZodValidationPipe(createOrganizacionSchema)) body: CreateOrganizacionDTO) {
    return this.createOrganizacionUseCase.execute(body);
  }

  @Permissions('organizaciones.create')
  @Post('con-providencia')
  createWithProvidencia(
    @Body(new ZodValidationPipe(createOrganizacionConProvidenciaSchema)) body: CreateOrganizacionConProvidenciaDTO
  ) {
    return this.createOrganizacionConProvidenciaUseCase.execute(body);
  }

  @Permissions('organizaciones.view')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.getOrganizacionUseCase.execute(id);
    } catch (error) {
      console.error('OrganizacionesController.getOne error', { id, error });
      throw error;
    }
  }

  @Permissions({ mode: 'all', permissions: ['organizaciones.view', 'organizaciones.update'] })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateOrganizacionSchema)) body: UpdateOrganizacionDTO
  ) {
    return this.updateOrganizacionUseCase.execute(id, body);
  }

  @Permissions({ mode: 'all', permissions: ['organizaciones.view', 'organizaciones.delete'] })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteOrganizacionUseCase.execute(id);
  }
}
