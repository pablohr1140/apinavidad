import { Injectable } from '@nestjs/common';

import {
  createOrganizacionConProvidenciaSchema,
  type CreateOrganizacionConProvidenciaDTO
} from '@/application/dtos/OrganizacionDTOs';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AppError } from '@/shared/errors/AppError';

@Injectable()
export class CreateOrganizacionConProvidenciaUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: unknown) {
    const payload = createOrganizacionConProvidenciaSchema.parse(data) as CreateOrganizacionConProvidenciaDTO;
    const codigo = payload.providencia.codigo.trim().toUpperCase();
    const nombreProvidencia = payload.providencia.nombre.trim();
    const nombreOrg = payload.organizacion.nombre.trim();

    return this.prisma.$transaction(async (tx) => {
      const providencia = await tx.providencias.upsert({
        where: { codigo },
        update: { nombre: nombreProvidencia, codigo, activo: true },
        create: { nombre: nombreProvidencia, codigo, activo: true }
      }).catch((error: unknown) => {
        if (error instanceof Error) {
          throw new AppError(`Error creando/actualizando providencia: ${error.message}`, 400);
        }
        throw error;
      });

      const org = await tx.organizaciones.create({
        data: {
          nombre: nombreOrg,
          tipo: 'Providencia',
          direccion: payload.organizacion.direccion ?? null,
          telefono: payload.organizacion.telefono ?? null,
          email: payload.organizacion.email ?? null,
          providencia_id: providencia.id,
          sector_id: payload.organizacion.sectorId ?? null,
          estado: payload.organizacion.estado ?? 'borrador'
        }
      });

      return {
        id: Number(org.id),
        nombre: org.nombre,
        tipo: org.tipo,
        direccion: org.direccion ?? undefined,
        telefono: org.telefono ?? undefined,
        email: org.email ?? undefined,
        providenciaId: org.providencia_id ?? undefined,
        sectorId: org.sector_id ?? undefined,
        estado: org.estado,
        createdAt: org.created_at,
        updatedAt: org.updated_at,
        providencia: {
          id: providencia.id,
          nombre: providencia.nombre,
          codigo: providencia.codigo ?? undefined,
          activo: providencia.activo,
          createdAt: providencia.created_at,
          updatedAt: providencia.updated_at
        }
      };
    });
  }
}
