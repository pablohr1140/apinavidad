/**
 * # Prisma Persona Repository
 * Propósito: Repositorio Prisma Prisma Persona Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

/**
 * # PrismaPersonaRepository
 *
 * Propósito: implementación Prisma de `PersonaRepository` con soporte de búsqueda y asignación de roles.
 * Pertenece a: Infra/database.
 * Interacciones: tablas `personas` y `roles`; maneja compatibilidad case-insensitive por driver.
 */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PersonaCreateInput, PersonaRepository, PersonaUpdateInput } from '@/application/repositories/PersonaRepository';
import { PersonaProps } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppError } from '@/shared/errors/AppError';

const PERSONA_INCLUDE = {
  roles: true
} as const;

const supportsCaseInsensitive = () => {
  const url = process.env.DATABASE_URL?.toLowerCase() ?? '';
  return !url.startsWith('sqlserver:');
};

const buildContainsFilter = (value: string) =>
  supportsCaseInsensitive() ? { contains: value, mode: 'insensitive' as const } : { contains: value };

type PersonaWithRole = Prisma.personasGetPayload<{ include: typeof PERSONA_INCLUDE }>;

type PersonaCreateData = Omit<PersonaCreateInput, 'roleKeys' | 'roleId'>;
type PersonaUpdateData = Omit<PersonaUpdateInput, 'roleKeys' | 'roleId'>;

@Injectable()
export class PrismaPersonaRepository implements PersonaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params?: { organizacionId?: number; search?: string }): Promise<PersonaProps[]> {
    const where: Prisma.personasWhereInput = {};

    if (params?.organizacionId) {
      where.organizacion_persona = {
        some: { organizacion_id: params.organizacionId }
      };
    }

    if (params?.search?.trim()) {
      const value = params.search.trim();
      where.OR = [
        { nombres: buildContainsFilter(value) },
        { apellidos: buildContainsFilter(value) },
        { run: buildContainsFilter(value) }
      ];
    }

    const personas = await this.prisma.personas.findMany({
      where,
      include: PERSONA_INCLUDE,
      orderBy: { created_at: 'desc' }
    });

    return personas.map((persona) => this.toDomain(persona));
  }

  /** Recupera persona por id incluyendo rol. */
  async findById(id: number): Promise<PersonaProps | null> {
    const persona = await this.prisma.personas.findUnique({
      where: { id },
      include: PERSONA_INCLUDE
    });

    return persona ? this.toDomain(persona) : null;
  }

  async create(data: PersonaCreateInput): Promise<PersonaProps> {
    const { roleKeys, roleId, ...writeData } = data;
    const resolvedRoleId = await this.resolveRoleId(roleKeys, roleId);
    const persona = await this.prisma.personas.create({
      data: {
        ...this.mapCreateData(writeData),
        role_id: resolvedRoleId ?? null
      },
      include: PERSONA_INCLUDE
    });

    return this.toDomain(persona);
  }

  async update(id: number, data: PersonaUpdateInput): Promise<PersonaProps> {
    const { roleKeys, roleId, ...writeData } = data;
    const resolvedRoleId = await this.resolveRoleId(roleKeys, roleId);
    const persona = await this.prisma.personas
      .update({
        where: { id },
        data: {
          ...this.mapUpdateData(writeData),
          role_id: resolvedRoleId === undefined ? undefined : resolvedRoleId
        },
        include: PERSONA_INCLUDE
      })
      .catch((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
          throw new AppError('Persona no encontrada', 404);
        }
        throw error;
      });

    return this.toDomain(persona);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.personas.delete({ where: { id } });
  }

  private toDomain(persona: PersonaWithRole): PersonaProps {
    return {
      id: persona.id,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      run: persona.run ?? undefined,
      dv: persona.dv ?? undefined,
      fecha_nacimiento: persona.fecha_nacimiento ?? undefined,
      sexo: persona.sexo ?? undefined,
      telefono: persona.telefono ?? undefined,
      email: persona.email ?? undefined,
      email_verified_at: persona.email_verified_at ?? undefined,
      password: persona.password ?? undefined,
      rememberToken: persona.remember_token ?? undefined,
      direccion: persona.direccion ?? undefined,
      providenciaId: persona.providencia_id ?? undefined,
      esRepresentante: persona.es_representante,
      roles: persona.roles
        ? [
            {
              id: persona.roles.id,
              key: persona.roles.role_key as never,
              name: persona.roles.name,
              rank: persona.roles.rank
            }
          ]
        : [],
      createdAt: persona.created_at,
      updatedAt: persona.updated_at
    };
  }

  private mapCreateData(data: PersonaCreateData): Prisma.personasUncheckedCreateInput {
    return {
      nombres: data.nombres,
      apellidos: data.apellidos,
      run: data.run ?? null,
      dv: data.dv ?? null,
      fecha_nacimiento: data.fecha_nacimiento ?? null,
      sexo: data.sexo ?? null,
      telefono: data.telefono ?? null,
      email: data.email ?? null,
      email_verified_at: data.email_verified_at ?? null,
      password: data.password ?? null,
      remember_token: data.rememberToken ?? null,
      direccion: data.direccion ?? null,
      providencia_id: data.providenciaId ?? null,
      es_representante: data.esRepresentante
    };
  }

  private mapUpdateData(data: PersonaUpdateData): Prisma.personasUncheckedUpdateInput {
    const payload: Prisma.personasUncheckedUpdateInput = {};

    if (data.nombres !== undefined) payload.nombres = data.nombres;
    if (data.apellidos !== undefined) payload.apellidos = data.apellidos;
    if (data.run !== undefined) payload.run = data.run;
    if (data.dv !== undefined) payload.dv = data.dv;
    if (data.fecha_nacimiento !== undefined) payload.fecha_nacimiento = data.fecha_nacimiento;
    if (data.sexo !== undefined) payload.sexo = data.sexo;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email = data.email;
    if (data.email_verified_at !== undefined) payload.email_verified_at = data.email_verified_at;
    if (data.password !== undefined) payload.password = data.password;
    if (data.rememberToken !== undefined) payload.remember_token = data.rememberToken;
    if (data.direccion !== undefined) payload.direccion = data.direccion;
    if (data.providenciaId !== undefined) payload.providencia_id = data.providenciaId;
    if (data.esRepresentante !== undefined) payload.es_representante = data.esRepresentante;

    return payload;
  }

  private async resolveRoleId(roleKeys?: string[], roleId?: number | null) {
    if (roleId !== undefined) {
      return roleId;
    }

    if (!roleKeys) {
      return undefined;
    }

    const uniqueKeys = Array.from(new Set(roleKeys));
    if (uniqueKeys.length === 0) {
      return null;
    }

    if (uniqueKeys.length > 1) {
      throw new AppError('Solo se permite un rol por persona', 400);
    }

    const role = await this.prisma.roles.findUnique({ where: { role_key: uniqueKeys[0] } });
    if (!role) {
      throw new AppError(`Rol no válido: ${uniqueKeys[0]}`, 400);
    }

    return role.id;
  }
}
