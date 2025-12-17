/**
 * NinosController
 * Capa: HTTP
 * Responsabilidad: Exponer CRUD y acciones de niños (listado, alta, lectura, edición, inhabilitar/restaurar, auto-inhabilitar lote).
 * Seguridad actual: guardias globales + `@Permissions` según acción (view/create/update). Sin endpoints públicos.
 * Endpoints y contratos:
 *  - GET /ninos: Query { periodoId?, organizacionId?, estado?, page?, limit? } -> resp paginada según use case.
 *  - POST /ninos: Body CreateNinoDTO (Zod) -> resp niño creado.
 *  - GET /ninos/:id: Param id (int) -> resp detalle.
 *  - PUT /ninos/:id: Body UpdateNinoDTO -> resp niño actualizado.
 *  - POST /ninos/:id/inhabilitar: Body InhabilitarNinoDTO -> resp resultado de inhabilitación.
 *  - POST /ninos/:id/restaurar: sin body -> resp restauración.
 *  - POST /ninos/auto-inhabilitar: Body AutoInhabilitarNinosDTO -> resp lote procesado.
 * Headers/cookies: requiere cookies de auth; `X-CSRF-Token` en mutaciones POST/PUT; Authorization Bearer opcional.
 * Ejemplo de integración frontend (descriptivo): usar GET paginado para listados; para editar, enviar PUT con DTO validado; inhabilitar/restaurar via POST a la acción con CSRF y cookies.
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
import { ListNinosQueryDto } from '@/application/dtos/NinoListDTO';
import { AutoInhabilitarNinosUseCase } from '@/application/use-cases/ninos/AutoInhabilitarNinosUseCase';
import { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import { GetNinoUseCase } from '@/application/use-cases/ninos/GetNinoUseCase';
import { InhabilitarNinoUseCase } from '@/application/use-cases/ninos/InhabilitarNinoUseCase';
import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { RestaurarNinoUseCase } from '@/application/use-cases/ninos/RestaurarNinoUseCase';
import { UpdateNinoUseCase } from '@/application/use-cases/ninos/UpdateNinoUseCase';
import type { EstadoNino } from '@/domain/entities';
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
  list(@Query() query: ListNinosQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;

    return this.listNinosUseCase.execute({
      periodoId: query.periodoId,
      organizacionId: query.organizacionId,
      estado: this.parseEstado(query.estado),
      skip,
      take: limit
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

  private parseBoolean(value?: string) {
    if (value === undefined) return undefined;
    if (value === '1' || value?.toLowerCase() === 'true') return true;
    if (value === '0' || value?.toLowerCase() === 'false') return false;
    return undefined;
  }

  private parseEstado(value?: string): EstadoNino | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    const allowed = ['registrado', 'inhabilitado'];
    return allowed.includes(normalized) ? (normalized as EstadoNino) : undefined;
  }
}
