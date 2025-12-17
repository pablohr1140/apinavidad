/**
 * PersonasController
 * Capa: HTTP
 * Responsabilidad: CRUD de personas (listar, crear, leer, actualizar, borrar) con validación Zod.
 * Seguridad actual: Guards globales + `@Permissions` por acción (`personas.view/create/update/delete`). Delete exige usuario autenticado via `@AuthUser`.
 * Interacciones: casos de uso de personas, decoradores `@Permissions` y `@AuthUser`, pipes Nest/Zod.
 * Notas: el borrado devuelve 204; lanza Forbidden si no hay user en contexto (asumido poblado por PasetoAuthGuard).
 */
import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import {
  createPersonaSchema,
  updatePersonaSchema,
  type CreatePersonaDTO,
  type UpdatePersonaDTO
} from '@/application/dtos/PersonaDTOs';
import { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';
import { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';
import { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { ZodValidationPipe } from '@/modules/shared/pipes/zod-validation.pipe';

@Controller('personas')
export class PersonasController {
  constructor(
    private readonly listPersonasUseCase: ListPersonasUseCase,
    private readonly createPersonaUseCase: CreatePersonaUseCase,
    private readonly getPersonaUseCase: GetPersonaUseCase,
    private readonly updatePersonaUseCase: UpdatePersonaUseCase,
    private readonly deletePersonaUseCase: DeletePersonaUseCase
  ) {}

  @Permissions('personas.view')
  @Get()
  list(@Query('organizacionId') organizacionId?: string, @Query('search') search?: string) {
    const orgId = organizacionId ? Number(organizacionId) : undefined;
    return this.listPersonasUseCase.execute({
      organizacionId: Number.isNaN(orgId) ? undefined : orgId,
      search: search ?? undefined
    });
  }

  @Permissions('personas.create')
  @Post()
  create(@Body(new ZodValidationPipe(createPersonaSchema)) body: CreatePersonaDTO) {
    return this.createPersonaUseCase.execute(body);
  }

  @Permissions('personas.view')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getPersonaUseCase.execute(id);
  }

  @Permissions({ mode: 'all', permissions: ['personas.view', 'personas.update'] })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(updatePersonaSchema)) body: UpdatePersonaDTO) {
    return this.updatePersonaUseCase.execute(id, body);
  }

  @Permissions({ mode: 'all', permissions: ['personas.view', 'personas.delete'] })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number, @AuthUser() user: AuthenticatedUser) {
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    await this.deletePersonaUseCase.execute(id, user);
  }
}
