/**
 * # Prisma Persona Repository.spec
 * Propósito: Prueba unitaria Prisma Persona Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { Prisma } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { PersonaCreateInput } from '@/application/repositories/PersonaRepository';
import type { RoleKey } from '@/domain/access-control';
import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPersonaRepository } from '@/infra/database/repositories/PrismaPersonaRepository';
import { AppError } from '@/shared/errors/AppError';

const PERSONA_BASE_DATES = {
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z')
};

type PersonaRecord = Prisma.personasGetPayload<{
  include: { roles: true };
}>;

const createRole = (roleOverrides?: Partial<PersonaRecord['roles']>): PersonaRecord['roles'] => ({
  id: 10,
  role_key: 'ADMIN',
  name: 'Admin',
  rank: 1,
  description: null,
  created_at: PERSONA_BASE_DATES.createdAt,
  updated_at: PERSONA_BASE_DATES.updatedAt,
  ...roleOverrides
});

const createPersonaRecord = (overrides?: Partial<PersonaRecord>): PersonaRecord => ({
  id: 1,
  nombres: 'Ana',
  apellidos: 'Pérez',
  run: '11111111',
  dv: '1',
  fecha_nacimiento: new Date('1990-01-01T00:00:00Z'),
  sexo: 'F',
  telefono: null,
  email: 'ana@example.com',
  email_verified_at: null,
  password: null,
  remember_token: null,
  direccion: 'Calle Falsa 123',
  providencia_id: 7,
  es_representante: true,
  role_id: 10,
  roles: createRole(),
  created_at: PERSONA_BASE_DATES.createdAt,
  updated_at: PERSONA_BASE_DATES.updatedAt,
  ...overrides
});

const createPrismaStub = () => {
  const personas = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };
  const roles = {
    findUnique: vi.fn()
  };

  return {
    service: { personas, roles } as unknown as PrismaService,
    personas,
    roles
  };
};

describe('PrismaPersonaRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaPersonaRepository;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(() => {
    process.env.DATABASE_URL = 'postgresql://vitest-suite';
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaPersonaRepository(prismaStub.service);
  });

  it('applies search/organizacion filters and maps persona data', async () => {
    const record = createPersonaRecord();
    prismaStub.personas.findMany.mockResolvedValueOnce([record]);

    const personas = await repository.findMany({ organizacionId: 77, search: '  Ana ' });

    expect(prismaStub.personas.findMany).toHaveBeenCalledWith({
      where: {
        organizacion_persona: { some: { organizacion_id: 77 } },
        OR: [
          { nombres: { contains: 'Ana', mode: 'insensitive' } },
          { apellidos: { contains: 'Ana', mode: 'insensitive' } },
          { run: { contains: 'Ana', mode: 'insensitive' } }
        ]
      },
      include: expect.any(Object),
      orderBy: { created_at: 'desc' }
    });
    expect(personas[0]).toMatchObject({ nombres: 'Ana' });
    expect(personas[0].rememberToken).toBeUndefined();
  });

  it('findById incluye roles y retorna null cuando no existe', async () => {
    const record = createPersonaRecord({ id: 44 });
    prismaStub.personas.findUnique
      .mockResolvedValueOnce(record)
      .mockResolvedValueOnce(null);

    const persona = await repository.findById(44);
    const missing = await repository.findById(45);

    expect(prismaStub.personas.findUnique).toHaveBeenNthCalledWith(1, {
      where: { id: 44 },
      include: expect.any(Object)
    });
    expect(prismaStub.personas.findUnique).toHaveBeenNthCalledWith(2, {
      where: { id: 45 },
      include: expect.any(Object)
    });
    expect(persona?.id).toBe(44);
    expect(persona?.roles).toHaveLength(1);
    expect(missing).toBeNull();
  });

  it('creates personas con un solo rol por clave', async () => {
    const record = createPersonaRecord();
    prismaStub.roles.findUnique.mockResolvedValueOnce({ id: 9, role_key: 'ADMIN', name: 'Admin', rank: 1 });
    prismaStub.personas.create.mockResolvedValueOnce(record);

    const payload: PersonaCreateInput = {
      nombres: 'Ana',
      apellidos: 'Pérez',
      esRepresentante: true,
      createdAt: PERSONA_BASE_DATES.createdAt,
      updatedAt: PERSONA_BASE_DATES.updatedAt,
      roleKeys: ['ADMIN', 'ADMIN'] as RoleKey[]
    };

    const persona = await repository.create(payload);

    expect(prismaStub.roles.findUnique).toHaveBeenCalledWith({ where: { role_key: 'ADMIN' } });
    expect(prismaStub.personas.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        role_id: 9,
        es_representante: true
      }),
      include: expect.any(Object)
    });
    expect(persona.roles).toHaveLength(1);
  });

  it('skips role lookups when no role keys are provided', async () => {
    const record = createPersonaRecord({ roles: null, role_id: null });
    prismaStub.personas.create.mockResolvedValueOnce(record);

    const payload: PersonaCreateInput = {
      nombres: 'Carlos',
      apellidos: 'Quispe',
      esRepresentante: false,
      createdAt: PERSONA_BASE_DATES.createdAt,
      updatedAt: PERSONA_BASE_DATES.updatedAt
    };

    await repository.create(payload);

    expect(prismaStub.roles.findUnique).not.toHaveBeenCalled();
    expect(prismaStub.personas.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ es_representante: false }),
      include: expect.any(Object)
    });
  });

  it('actualiza el rol directo cuando se envían nuevas keys', async () => {
    const record = createPersonaRecord({
      roles: createRole({ id: 9, role_key: 'DIDECO', name: 'Dideco', rank: 2 }),
      role_id: 9
    });
    prismaStub.roles.findUnique.mockResolvedValueOnce({ id: 9, role_key: 'DIDECO', name: 'Dideco', rank: 2 });
    prismaStub.personas.update.mockResolvedValueOnce(record);

    const persona = await repository.update(55, {
      nombres: 'Ana Actualizada',
      email: 'nuevo@example.com',
      roleKeys: ['DIDECO']
    });

    expect(prismaStub.personas.update).toHaveBeenCalledWith({
      where: { id: 55 },
        data: expect.objectContaining({
          nombres: 'Ana Actualizada',
          email: 'nuevo@example.com',
          role_id: 9
        }),
      include: expect.any(Object)
    });
    expect(persona.roles.map((role) => role.key)).toEqual(['DIDECO']);
  });

  it('remueve el rol cuando se envía arreglo vacío', async () => {
    const record = createPersonaRecord({ roles: null, role_id: null });
    prismaStub.personas.update.mockResolvedValueOnce(record);

    await repository.update(88, { roleKeys: [] });

    expect(prismaStub.personas.update).toHaveBeenCalledWith({
      where: { id: 88 },
      data: expect.objectContaining({
        role_id: null
      }),
      include: expect.any(Object)
    });
  });

  it('throws AppError when update target does not exist', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError('Missing', {
      code: 'P2025',
      clientVersion: '5.22.0'
    });
    prismaStub.personas.update.mockRejectedValueOnce(prismaError);

    await expect(repository.update(999, { nombres: 'noop' })).rejects.toBeInstanceOf(AppError);
  });

  it('valida keys desconocidas antes de mutar', async () => {
    prismaStub.roles.findUnique.mockResolvedValueOnce(null);

    const payload: PersonaCreateInput = {
      nombres: 'Error',
      apellidos: 'Case',
      esRepresentante: true,
      createdAt: PERSONA_BASE_DATES.createdAt,
      updatedAt: PERSONA_BASE_DATES.updatedAt,
      roleKeys: ['DIDECO'] as RoleKey[]
    };

    await expect(repository.create(payload)).rejects.toThrow('Rol no válido: DIDECO');
    expect(prismaStub.personas.create).not.toHaveBeenCalled();
  });

  it('delete delega en Prisma client', async () => {
    prismaStub.personas.delete.mockResolvedValueOnce(undefined);

    await repository.delete(23);

    expect(prismaStub.personas.delete).toHaveBeenCalledWith({ where: { id: 23 } });
  });
});
