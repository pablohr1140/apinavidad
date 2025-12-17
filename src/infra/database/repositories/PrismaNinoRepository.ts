/**
 * # PrismaNinoRepository
 *
 * Propósito: implementación Prisma de `NinoRepository` incluyendo reglas de auto-inhabilitación.
 * Pertenece a: Infra/database.
 * Interacciones: tabla `ninos`, reglas de negocio de edad, BigInt para claves foráneas.
 */
import { Injectable } from '@nestjs/common';
import { Prisma, ninos } from '@prisma/client';
import { NinoRepository } from '@/application/repositories/NinoRepository';
import { EstadoNino, NinoProps } from '@/domain/entities';
import { MAX_EDAD, calcularEdad, prepararInhabilitacion } from '@/domain/services/ninoRules';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppError } from '@/shared/errors/AppError';

const toBigInt = (value?: number | null) => (value === undefined || value === null ? null : BigInt(value));
const toDate = (value?: Date | string | null) => (value ? new Date(value) : undefined);
const estadoToDb = (estado?: EstadoNino) => {
  if (estado === undefined) return undefined;
  if (estado === 'inhabilitado') return false;
  return true; // registrado -> true
};
const estadoToDomain = (estadoBit: boolean): EstadoNino => (estadoBit ? 'registrado' : 'inhabilitado');

@Injectable()
export class PrismaNinoRepository implements NinoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params?: {
    periodoId?: number;
    organizacionId?: number;
    estado?: EstadoNino;
    edadMin?: number;
    edadMax?: number;
    prioridad?: number;
    tiempoParaInhabilitar?: number;
    skip?: number;
    take?: number;
  }): Promise<NinoProps[]> {
    const where: Prisma.ninosWhereInput = {};

    if (params?.periodoId !== undefined) {
      where.periodo_id = params.periodoId;
    }

    if (params?.organizacionId !== undefined) {
      where.organizacion_id = toBigInt(params.organizacionId);
    }

    if (params?.estado !== undefined) {
      where.estado = estadoToDb(params.estado);
    }

    if (params?.edadMin !== undefined || params?.edadMax !== undefined) {
      const min = params.edadMin ?? 0;
      const max = params.edadMax ?? MAX_EDAD;
      where.edad = { gte: min, lte: max };
    }

    // Nota: el filtro por prioridad se omite porque el esquema Prisma no expone dicho campo.

    const take = params?.take !== undefined ? Math.min(Math.max(params.take, 1), 500) : 100;
    const skip = params?.skip ?? 0;

    const records = await this.prisma.ninos.findMany({
      where,
      orderBy: [
        { organizacion_id: 'asc' },
        { apellidos: 'asc' },
        { nombres: 'asc' },
        { id: 'asc' }
      ],
      skip,
      take
    });
    return records.map((record) => this.toDomain(record));
  }

  async findById(id: number): Promise<NinoProps | null> {
    const nino = await this.prisma.ninos.findUnique({ where: { id: BigInt(id) } });
    return nino ? this.toDomain(nino) : null;
  }

  async create(data: Omit<NinoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<NinoProps> {
    const created = await this.prisma.ninos.create({
      data: this.mapCreateData(data)
    });

    return this.toDomain(created);
  }

  async update(id: number, data: Partial<Omit<NinoProps, 'id'>>): Promise<NinoProps> {
    const updated = await this.prisma.ninos.update({
      where: { id: BigInt(id) },
      data: this.mapUpdateData(data)
    });

    return this.toDomain(updated);
  }

  async inhabilitar(id: number, payload: { fecha: Date; motivo: string }): Promise<NinoProps> {
    const nino = await this.prisma.ninos.findUnique({ where: { id: BigInt(id) } });
    if (!nino) {
      throw new AppError('Niño no encontrado', 404);
    }

    if (nino.fecha_ingreso && payload.fecha < nino.fecha_ingreso) {
      throw new AppError('La fecha no puede ser anterior al ingreso', 400);
    }

    const updated = await this.prisma.ninos.update({
      where: { id: nino.id },
      data: { estado: false, fecha_retiro: payload.fecha }
    });

    return this.toDomain(updated);
  }

  async restaurar(id: number): Promise<NinoProps> {
    const updated = await this.prisma.ninos.update({
      where: { id: BigInt(id) },
      data: { estado: true, fecha_retiro: null }
    });

    return this.toDomain(updated);
  }

  async autoInhabilitar(
    fechaReferencia: Date,
    dryRun = false
  ): Promise<{ afectados: number } & { detalles?: NinoProps[] }> {
    const candidatos = await this.prisma.ninos.findMany({ where: { estado: true } });
    const candidatosDomain = candidatos.map((record) => this.toDomain(record));

    const porInhabilitar = candidatosDomain.filter((nino) => {
      const nacimiento = nino.fecha_nacimiento;
      if (!nacimiento) return false;
      const edad = calcularEdad(nacimiento, fechaReferencia);
      return edad !== null && edad >= MAX_EDAD;
    });

    if (dryRun) {
      return { afectados: porInhabilitar.length, detalles: porInhabilitar };
    }

    await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        porInhabilitar.map((nino) => {
          const data = prepararInhabilitacion(nino, fechaReferencia);
          return tx.ninos.update({ where: { id: BigInt(nino.id) }, data: { ...data, estado: estadoToDb(data.estado) } });
        })
      );
    });

    return { afectados: porInhabilitar.length };
  }

  private mapCreateData(data: Omit<NinoProps, 'id' | 'createdAt' | 'updatedAt'>): Prisma.ninosUncheckedCreateInput {
    return {
      nombres: data.nombres,
      apellidos: data.apellidos ?? null,
      documento_numero: data.documento_numero,
      tipo_documento_id: data.tipoDocumentoId ?? null,
      nacionalidad_id: data.nacionalidadId ?? null,
      etnia_id: data.etniaId ?? null,
      persona_registro_id: data.personaRegistroId ?? null,
      fecha_nacimiento: data.fecha_nacimiento ?? null,
      sexo: data.sexo ?? null,
      organizacion_id: toBigInt(data.organizacionId),
      periodo_id: data.periodoId,
      edad: data.edad ?? null,
      tiene_discapacidad: data.tiene_discapacidad,
      tiene_RSH: data.tiene_RSH,
      fecha_ingreso: data.fecha_ingreso ?? null,
      fecha_retiro: data.fecha_retiro ?? null,
      estado: estadoToDb(data.estado) ?? true
    };
  }

  private mapUpdateData(data: Partial<Omit<NinoProps, 'id'>>): Prisma.ninosUncheckedUpdateInput {
    const payload: Prisma.ninosUncheckedUpdateInput = {};

    if (data.nombres !== undefined) payload.nombres = data.nombres;
    if (data.apellidos !== undefined) payload.apellidos = data.apellidos ?? null;
    if (data.documento_numero !== undefined) payload.documento_numero = data.documento_numero;
    if (data.tipoDocumentoId !== undefined) payload.tipo_documento_id = data.tipoDocumentoId ?? null;
    if (data.nacionalidadId !== undefined) payload.nacionalidad_id = data.nacionalidadId ?? null;
    if (data.etniaId !== undefined) payload.etnia_id = data.etniaId ?? null;
    if (data.personaRegistroId !== undefined) payload.persona_registro_id = data.personaRegistroId ?? null;
    if (data.fecha_nacimiento !== undefined) payload.fecha_nacimiento = data.fecha_nacimiento ?? null;
    if (data.sexo !== undefined) payload.sexo = data.sexo ?? null;
    if (data.organizacionId !== undefined) payload.organizacion_id = toBigInt(data.organizacionId);
    if (data.periodoId !== undefined) payload.periodo_id = data.periodoId;
    if (data.edad !== undefined) payload.edad = data.edad ?? null;
    if (data.tiene_discapacidad !== undefined) payload.tiene_discapacidad = data.tiene_discapacidad;
    if (data.tiene_RSH !== undefined) payload.tiene_RSH = data.tiene_RSH;
    if (data.fecha_ingreso !== undefined) payload.fecha_ingreso = data.fecha_ingreso ?? null;
    if (data.fecha_retiro !== undefined) payload.fecha_retiro = data.fecha_retiro ?? null;
    if (data.estado !== undefined) payload.estado = estadoToDb(data.estado);

    return payload;
  }

  private toDomain(entity: ninos): NinoProps {
    return {
      id: Number(entity.id),
      nombres: entity.nombres,
      apellidos: entity.apellidos ?? undefined,
      documento_numero: entity.documento_numero,
      tipoDocumentoId: entity.tipo_documento_id ?? undefined,
      nacionalidadId: entity.nacionalidad_id ?? undefined,
      etniaId: entity.etnia_id ?? undefined,
      personaRegistroId: entity.persona_registro_id ?? undefined,
      fecha_nacimiento: toDate(entity.fecha_nacimiento),
      sexo: entity.sexo ?? undefined,
      organizacionId: entity.organizacion_id !== null && entity.organizacion_id !== undefined ? Number(entity.organizacion_id) : undefined,
      periodoId: Number(entity.periodo_id),
      edad: entity.edad ?? undefined,
      tiene_discapacidad: Boolean(entity.tiene_discapacidad),
      tiene_RSH: Boolean(entity.tiene_RSH),
      fecha_ingreso: toDate(entity.fecha_ingreso),
      fecha_retiro: toDate(entity.fecha_retiro),
      estado: estadoToDomain(Boolean(entity.estado)),
      createdAt: toDate(entity.created_at) ?? new Date(),
      updatedAt: toDate(entity.updated_at) ?? new Date()
    };
  }
}
