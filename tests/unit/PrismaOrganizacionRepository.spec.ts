/**
 * # Prisma Organizacion Repository.spec
 * Propósito: Prueba unitaria Prisma Organizacion Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OrganizacionProps } from '@/domain/entities';
import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaOrganizacionRepository } from '@/infra/database/repositories/PrismaOrganizacionRepository';
import { AppError } from '@/shared/errors/AppError';

const ORGANIZACION_DATES = {
  createdAt: new Date('2024-02-01T00:00:00Z'),
  updatedAt: new Date('2024-02-02T00:00:00Z')
};

type OrganizacionRecord = Prisma.organizacionesGetPayload<Record<string, never>>;

const createOrganizacionRecord = (overrides?: Partial<OrganizacionRecord>): OrganizacionRecord => ({
  id: 1,
  nombre: 'Organización Uno',
  sigla: null,
  rut: null,
  tipo: 'ONG',
  direccion: null,
  telefono: null,
  email: 'contacto@orguno.cl',
  providencia_id: 5,
  estado: 'activo',
  created_at: ORGANIZACION_DATES.createdAt,
  updated_at: ORGANIZACION_DATES.updatedAt,
  ...overrides
});

const createPrismaStub = () => {
  const organizaciones = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  return {
    service: { organizaciones } as unknown as PrismaService,
    organizaciones
  };
};

describe('PrismaOrganizacionRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaOrganizacionRepository;

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaOrganizacionRepository(prismaStub.service);
  });

  it('filters organizaciones by estado y tipo', async () => {
    const record = createOrganizacionRecord();
    prismaStub.organizaciones.findMany.mockResolvedValueOnce([record]);

    const organizaciones = await repository.findMany({ estado: 'activo', tipo: 'ONG' });

    expect(prismaStub.organizaciones.findMany).toHaveBeenCalledWith({
      where: { estado: 'activo', tipo: 'ONG' },
      orderBy: { created_at: 'desc' }
    });
    expect(organizaciones[0]).toMatchObject<OrganizacionProps>({
      nombre: 'Organización Uno',
      sigla: undefined,
      providenciaId: 5,
      estado: 'activo'
    });
  });

  it('findById retorna dominio cuando existe y null en caso contrario', async () => {
    const record = createOrganizacionRecord({ id: 99, sigla: 'ORG' });
    prismaStub.organizaciones.findUnique
      .mockResolvedValueOnce(record)
      .mockResolvedValueOnce(null);

    const found = await repository.findById(99);
    const missing = await repository.findById(100);

    expect(prismaStub.organizaciones.findUnique).toHaveBeenNthCalledWith(1, { where: { id: 99 } });
    expect(prismaStub.organizaciones.findUnique).toHaveBeenNthCalledWith(2, { where: { id: 100 } });
    expect(found).toMatchObject({ id: 99, sigla: 'ORG' });
    expect(missing).toBeNull();
  });

  it('maps optional fields to null when creating registros', async () => {
    const record = createOrganizacionRecord();
    prismaStub.organizaciones.create.mockResolvedValueOnce(record);

    await repository.create({
      nombre: 'Org Nueva',
      tipo: 'ONG',
      estado: 'borrador'
    });

    expect(prismaStub.organizaciones.create).toHaveBeenCalledWith({
      data: {
        nombre: 'Org Nueva',
        sigla: null,
        rut: null,
        tipo: 'ONG',
        direccion: null,
        telefono: null,
        email: null,
        providencia_id: null,
        estado: 'borrador'
      }
    });
  });

  it('only updates provided fields and keeps others untouched', async () => {
    const record = createOrganizacionRecord({ estado: 'suspendido' });
    prismaStub.organizaciones.update.mockResolvedValueOnce(record);

    await repository.update(33, {
      nombre: 'Org Editada',
      telefono: '+56 9 1234 5678',
      estado: 'suspendido'
    });

    expect(prismaStub.organizaciones.update).toHaveBeenCalledWith({
      where: { id: 33 },
      data: {
        nombre: 'Org Editada',
        telefono: '+56 9 1234 5678',
        estado: 'suspendido'
      }
    });
  });

  it('throws AppError when updating an organización inexistente', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Missing', {
      code: 'P2025',
      clientVersion: '5.22.0'
    });
    prismaStub.organizaciones.update.mockRejectedValueOnce(prismaError);

    await expect(
      repository.update(404, { nombre: 'no existe' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('propagates deletes directly to Prisma client', async () => {
    prismaStub.organizaciones.delete.mockResolvedValueOnce(undefined);

    await repository.delete(12);

    expect(prismaStub.organizaciones.delete).toHaveBeenCalledWith({ where: { id: 12 } });
  });
});
