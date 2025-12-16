/**
 * # organizaciones.controller
 * Propósito: Endpoints HTTP de organizaciones.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # OrganizacionesController
 *
 * Propósito: expone endpoints CRUD para organizaciones con validación y permisos.
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de organizaciones, pipe Zod, decorator de permisos.
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
