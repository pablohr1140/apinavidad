/**
 * # periodos.controller
 * Propósito: Endpoints HTTP de periodos.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # PeriodosController
 *
 * Propósito: administra endpoints de periodos (listado, creación, actualización y cambios de estado).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de periodos, validación Zod y permisos.
 */
import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import {
  createPeriodoSchema,
  updatePeriodoSchema,
  type CreatePeriodoDTO,
  type UpdatePeriodoDTO
} from '@/application/dtos/PeriodoDTOs';
import { ActivatePeriodoUseCase } from '@/application/use-cases/periodos/ActivatePeriodoUseCase';
import { ClosePeriodoUseCase } from '@/application/use-cases/periodos/ClosePeriodoUseCase';
import { CreatePeriodoUseCase } from '@/application/use-cases/periodos/CreatePeriodoUseCase';
import { ListPeriodosUseCase } from '@/application/use-cases/periodos/ListPeriodosUseCase';
import { OpenPeriodoUseCase } from '@/application/use-cases/periodos/OpenPeriodoUseCase';
import { UpdatePeriodoUseCase } from '@/application/use-cases/periodos/UpdatePeriodoUseCase';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';

@Controller('periodos')
export class PeriodosController {
  constructor(
    private readonly listPeriodosUseCase: ListPeriodosUseCase,
    private readonly createPeriodoUseCase: CreatePeriodoUseCase,
    private readonly updatePeriodoUseCase: UpdatePeriodoUseCase,
    private readonly openPeriodoUseCase: OpenPeriodoUseCase,
    private readonly closePeriodoUseCase: ClosePeriodoUseCase,
    private readonly activatePeriodoUseCase: ActivatePeriodoUseCase
  ) {}

  @Permissions('periodos.view')
  @Get()
  list(@Query('estado') estado?: string, @Query('activo', new ParseBoolPipe({ optional: true })) activo?: boolean) {
    return this.listPeriodosUseCase.execute({
      estado: estado ?? undefined,
      activo
    });
  }

  @Permissions('periodos.create')
  @Post()
  create(@Body(new ZodValidationPipe(createPeriodoSchema)) body: CreatePeriodoDTO) {
    return this.createPeriodoUseCase.execute(body);
  }

  @Permissions({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updatePeriodoSchema)) body: UpdatePeriodoDTO) {
    return this.updatePeriodoUseCase.execute(id, body);
  }

  @Permissions({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] })
  @Post(':id/open')
  open(@Param('id', ParseIntPipe) id: number) {
    return this.openPeriodoUseCase.execute(id);
  }

  @Permissions({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] })
  @Post(':id/close')
  close(@Param('id', ParseIntPipe) id: number) {
    return this.closePeriodoUseCase.execute(id);
  }

  @Permissions({ mode: 'all', permissions: ['periodos.view', 'periodos.update'] })
  @Post(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.activatePeriodoUseCase.execute(id);
  }
}
