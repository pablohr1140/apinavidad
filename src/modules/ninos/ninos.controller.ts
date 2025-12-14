/**
 * # ninos.controller
 * Propósito: Endpoints HTTP de ninos.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # NinosController
 *
 * Propósito: expone CRUD y acciones de niños (inhabilitar/restaurar/auto-inhabilitar).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: casos de uso de niños, validación Zod y permisos.
 */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';

import {
  createNinoSchema,
  updateNinoSchema,
  inhabilitarNinoSchema,
  autoInhabilitarSchema,
  type CreateNinoDTO,
  type UpdateNinoDTO,
  type InhabilitarNinoDTO,
  type AutoInhabilitarNinosDTO
} from '@/application/dtos/NinoDTOs';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
import { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';

@Controller('ninos')
export class NinosController {
  constructor(
    private readonly listNinosUseCase: ListNinosUseCase,
    private readonly createNinoUseCase: CreateNinoUseCase,
    private readonly getNinoUseCase: GetNinoUseCase,
    private readonly updateNinoUseCase: UpdateNinoUseCase,
    private readonly inhabilitarNinoUseCase: InhabilitarNinoUseCase,
    private readonly restaurarNinoUseCase: RestaurarNinoUseCase,
    private readonly autoInhabilitarNinosUseCase: AutoInhabilitarNinosUseCase
  ) {}

  @Permissions('ninos.view')
  @Get()
  list(
    @Query('periodoId') periodoId?: string,
    @Query('organizacionId') organizacionId?: string,
    @Query('estado') estado?: string
  ) {
    return this.listNinosUseCase.execute({
      periodoId: this.parseNumber(periodoId),
      organizacionId: this.parseNumber(organizacionId),
      estado: this.parseBoolean(estado)
    });
  }

  @Permissions('ninos.create')
  @Post()
  create(@Body(new ZodValidationPipe(createNinoSchema)) body: CreateNinoDTO) {
    return this.createNinoUseCase.execute(body);
  }

  @Permissions('ninos.view')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getNinoUseCase.execute(id);
  }

  @Permissions({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateNinoSchema)) body: UpdateNinoDTO
  ) {
    return this.updateNinoUseCase.execute(id, body);
  }

  @Permissions({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] })
  @Post(':id/inhabilitar')
  inhabilitar(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(inhabilitarNinoSchema)) body: InhabilitarNinoDTO
  ) {
    return this.inhabilitarNinoUseCase.execute(id, body);
  }

  @Permissions({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] })
  @Post(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.restaurarNinoUseCase.execute(id);
  }

  @Permissions({ mode: 'all', permissions: ['ninos.view', 'ninos.update'] })
  @Post('auto-inhabilitar')
  autoInhabilitar(@Body(new ZodValidationPipe(autoInhabilitarSchema)) body: AutoInhabilitarNinosDTO) {
    return this.autoInhabilitarNinosUseCase.execute(body);
  }

  private parseNumber(value?: string) {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private parseBoolean(value?: string) {
    if (value === undefined) return undefined;
    if (value === '1' || value?.toLowerCase() === 'true') return true;
    if (value === '0' || value?.toLowerCase() === 'false') return false;
    return undefined;
  }
}
