/**
 * # reportes.controller
 * Propósito: Endpoints HTTP de reportes.controller
 * Pertenece a: HTTP Controller (Nest)
 * Interacciones: Casos de uso, pipes/decorators Nest
 */

/**
 * # ReportesController
 *
 * Propósito: expone reportes derivados de niños (inhabilitados, listados con cálculos).
 * Pertenece a: Capa HTTP (NestJS controller).
 * Interacciones: `ListNinosUseCase`, reglas de negocio de edad/inhabilitación.
 */
import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { ListNinosUseCase } from '@/application/use-cases/ninos/ListNinosUseCase';
import { calcularEdad, MAX_EDAD } from '@/domain/services/ninoRules';
import type { EstadoNino } from '@/domain/entities';
import { ReportingService } from '@/infra/reporting/reporting.service';
import { Permissions } from '@/modules/auth/decorators/permissions.decorator';

@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly listNinosUseCase: ListNinosUseCase,
    private readonly reportingService: ReportingService
  ) {}

  @Permissions('ninos.view')
  @Get('ninos/inhabilitados')
  async listInhabilitados() {
    const ninos = await this.listNinosUseCase.execute({ estado: 'inhabilitado' });
    return { total: ninos.length, data: ninos };
  }

  @Permissions('ninos.view')
  @Get('ninos/listado')
  async listado(
    @Query('periodoId') periodoId?: string,
    @Query('organizacionId') organizacionId?: string,
    @Query('estado') estado?: string
  ) {
    const data = await this.buildNinosData(periodoId, organizacionId, estado);
    return { total: data.length, data };
  }

  @Permissions('ninos.view')
  @Get('ninos/listado.pdf')
  async listadoPdf(
    @Query('periodoId') periodoId: string | undefined,
    @Query('organizacionId') organizacionId: string | undefined,
    @Query('estado') estado: string | undefined,
    @Res() res: Response
  ) {
    const data = await this.buildNinosData(periodoId, organizacionId, estado);
    const pdf = await this.reportingService.buildPdf(data, 'Reporte de niños');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.pdf"');
    res.send(pdf);
  }

  @Permissions('ninos.view')
  @Get('ninos/listado.xlsx')
  async listadoExcel(
    @Query('periodoId') periodoId: string | undefined,
    @Query('organizacionId') organizacionId: string | undefined,
    @Query('estado') estado: string | undefined,
    @Res() res: Response
  ) {
    const data = await this.buildNinosData(periodoId, organizacionId, estado);
    const xlsx = await this.reportingService.buildExcel(data, 'Reporte de niños');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte-ninos.xlsx"');
    res.send(xlsx);
  }

  private async buildNinosData(
    periodoId?: string,
    organizacionId?: string,
    estado?: string
  ) {
    const ninos = await this.listNinosUseCase.execute({
      periodoId: this.toNumber(periodoId),
      organizacionId: this.toNumber(organizacionId),
      estado: this.parseEstado(estado)
    });

    return ninos.map((nino) => {
      const edadCalculada = calcularEdad(nino.fecha_nacimiento);
      const tiempoParaInhabilitar = edadCalculada != null ? Math.max(0, MAX_EDAD - edadCalculada) : null;
      return {
        ...nino,
        edad_calculada: edadCalculada,
        tiempo_para_inhabilitar: tiempoParaInhabilitar
      };
    });
  }

  private toNumber(value?: string) {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private parseEstado(value?: string): EstadoNino | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    const allowed = ['registrado', 'validado', 'egresado', 'inhabilitado'];
    return allowed.includes(normalized) ? (normalized as EstadoNino) : undefined;
  }
}
