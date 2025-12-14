/**
 * # prisma write.spec
 * Propósito: Prueba e2e prisma write.spec
 * Pertenece a: Tests (Prueba e2e)
 * Interacciones: Nest app, Supertest/Prisma
 */

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { describe, beforeAll, afterAll, beforeEach, it, expect, vi } from 'vitest';

import { AppModule } from '@/app.module';
import { CreateOrganizacionUseCase } from '@/application/use-cases/organizaciones/CreateOrganizacionUseCase';
import { DeleteOrganizacionUseCase } from '@/application/use-cases/organizaciones/DeleteOrganizacionUseCase';
import { UpdateOrganizacionUseCase } from '@/application/use-cases/organizaciones/UpdateOrganizacionUseCase';
import { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';
import { DeletePersonaUseCase } from '@/application/use-cases/personas/DeletePersonaUseCase';
import { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
import { env } from '@/config/env';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaOrganizacionRepository } from '@/infra/database/repositories/PrismaOrganizacionRepository';
import { PrismaPersonaRepository } from '@/infra/database/repositories/PrismaPersonaRepository';
import { PasetoAuthGuard } from '@/modules/auth/guards/paseto-auth.guard';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';
import { OrganizacionesController } from '@/modules/organizaciones/organizaciones.controller';
import { PersonasController } from '@/modules/personas/personas.controller';

interface OrganizacionRecord {
  id: number;
  nombre: string;
  sigla: string | null;
  rut: string | null;
  tipo: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  providencia_id: number | null;
  estado: string;
  created_at: Date;
  updated_at: Date;
}

interface RoleRecord {
  id: number;
  role_key: string;
  name: string;
  rank: number;
}

interface PersonaRecord {
  id: number;
  nombres: string;
  apellidos: string;
  run: string | null;
  dv: string | null;
  fecha_nacimiento: Date | null;
  sexo: string | null;
  telefono: string | null;
  email: string | null;
  email_verified_at: Date | null;
  password: string | null;
  remember_token: string | null;
  direccion: string | null;
  providencia_id: number | null;
  es_representante: boolean;
  role_id: number | null;
  roles: RoleRecord | null;
  created_at: Date;
  updated_at: Date;
}

const createOrganizacionRecord = (overrides: Partial<OrganizacionRecord> = {}): OrganizacionRecord => ({
  id: 1,
  nombre: 'Organizacion Prisma',
  sigla: null,
  rut: null,
  tipo: 'ONG',
  direccion: 'Calle 1',
  telefono: null,
  email: 'org@prisma.cl',
  providencia_id: 10,
  estado: 'activo',
  created_at: new Date('2024-01-01T00:00:00Z'),
  updated_at: new Date('2024-01-02T00:00:00Z'),
  ...overrides
});

const createPersonaRecord = (overrides: Partial<PersonaRecord> = {}): PersonaRecord => ({
  id: 10,
  nombres: 'Laura',
  apellidos: 'Prisma',
  run: '12345678-9',
  dv: '9',
  fecha_nacimiento: new Date('1995-01-01T00:00:00Z'),
  sexo: 'F',
  telefono: '+56912345678',
  email: 'laura@prisma.cl',
  email_verified_at: null,
  password: null,
  remember_token: null,
  direccion: 'Av Prisma 99',
  providencia_id: 11,
  es_representante: true,
  role_id: 9,
  roles: { id: 9, role_key: 'ADMIN', name: 'Admin', rank: 1 },
  created_at: new Date('2024-02-01T00:00:00Z'),
  updated_at: new Date('2024-02-02T00:00:00Z'),
  ...overrides
});

const createPrismaServiceMock = () => {
  const organizaciones = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  const personas = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  const roles = {
    findMany: vi.fn(),
    findUnique: vi.fn()
  };

  const service = {
    organizaciones,
    personas,
    roles,
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    $use: vi.fn()
  } as unknown as PrismaService;

  return {
    service,
    organizaciones,
    personas,
    roles
  };
};

const prismaMock = createPrismaServiceMock();
const originalPrismaReads = env.PRISMA_READS;
const originalPrismaWrites = env.PRISMA_WRITES;

const resetPrismaMockFns = () => {
  const resetGroup = (group: Record<string, ReturnType<typeof vi.fn>>) => {
    Object.values(group).forEach((mockFn) => mockFn.mockReset());
  };

  resetGroup(prismaMock.organizaciones);
  resetGroup(prismaMock.personas);
  resetGroup(prismaMock.roles);
};

describe('Prisma write integration', () => {
  let app: INestApplication;
  let pasetoGuardSpy: ReturnType<typeof vi.spyOn>;
  let permissionsGuardSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(async () => {
    env.PRISMA_READS = true;
    env.PRISMA_WRITES = true;
    process.env.PRISMA_READS = '1';
    process.env.PRISMA_WRITES = '1';
    process.env.NODE_ENV ??= 'test';

    pasetoGuardSpy = vi.spyOn(PasetoAuthGuard.prototype, 'canActivate').mockImplementation(async (context) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 1,
        email: 'prisma@test.cl',
        roles: [{ id: 1, key: 'SUPERADMIN', name: 'Superadmin', rank: 500 }],
        permissions: new Set(['organizaciones.create', 'organizaciones.update', 'organizaciones.delete', 'personas.create', 'personas.delete'])
      };
      return true;
    });
    permissionsGuardSpy = vi.spyOn(PermissionsGuard.prototype, 'canActivate').mockResolvedValue(true);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock.service)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const prismaOrganizacionRepository = new PrismaOrganizacionRepository(prismaMock.service);
    const prismaPersonaRepository = new PrismaPersonaRepository(prismaMock.service);

    const createOrganizacionUseCase = new CreateOrganizacionUseCase(prismaOrganizacionRepository);
    const updateOrganizacionUseCase = new UpdateOrganizacionUseCase(prismaOrganizacionRepository);
    const deleteOrganizacionUseCase = new DeleteOrganizacionUseCase(prismaOrganizacionRepository);
    const createPersonaUseCase = new CreatePersonaUseCase(prismaPersonaRepository);
    const updatePersonaUseCase = new UpdatePersonaUseCase(prismaPersonaRepository);
    const deletePersonaUseCase = new DeletePersonaUseCase(prismaPersonaRepository);

    const organizacionesController = app.get(OrganizacionesController);
    const personasController = app.get(PersonasController);

    Object.assign(organizacionesController, {
      createOrganizacionUseCase,
      updateOrganizacionUseCase,
      deleteOrganizacionUseCase
    });

    Object.assign(personasController, {
      createPersonaUseCase,
      updatePersonaUseCase,
      deletePersonaUseCase
    });
  });

  afterAll(async () => {
    env.PRISMA_READS = originalPrismaReads;
    env.PRISMA_WRITES = originalPrismaWrites;
    await app.close();
    vi.restoreAllMocks();
    delete process.env.PRISMA_READS;
    delete process.env.PRISMA_WRITES;
  });

  beforeEach(() => {
    resetPrismaMockFns();
    pasetoGuardSpy.mockClear();
    permissionsGuardSpy.mockClear();
  });

  it('POST /organizaciones persiste usando Prisma', async () => {
    const prismaResponse = createOrganizacionRecord({ id: 200, nombre: 'Org Prisma Nueva' });
    prismaMock.organizaciones.create.mockResolvedValueOnce(prismaResponse);

    const payload = {
      nombre: 'Org Prisma Nueva',
      tipo: 'ONG',
      estado: 'activo',
      email: 'nueva@prisma.cl'
    };

    const response = await request(app.getHttpServer()).post('/organizaciones').send(payload).expect(201);

    expect(prismaMock.organizaciones.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombre: 'Org Prisma Nueva',
        tipo: 'ONG',
        estado: 'activo',
        email: 'nueva@prisma.cl'
      })
    });
    expect(response.body).toEqual(expect.objectContaining({ id: 200, nombre: 'Org Prisma Nueva' }));
  });

  it('PUT /organizaciones/:id actualiza usando Prisma', async () => {
    const existing = createOrganizacionRecord({ id: 55, nombre: 'Org Vieja' });
    const updated = createOrganizacionRecord({ id: 55, nombre: 'Org Actualizada', estado: 'suspendido' });
    prismaMock.organizaciones.findUnique.mockResolvedValueOnce(existing);
    prismaMock.organizaciones.update.mockResolvedValueOnce(updated);

    const response = await request(app.getHttpServer())
      .put('/organizaciones/55')
      .send({ nombre: 'Org Actualizada', estado: 'suspendido' })
      .expect(200);

    expect(prismaMock.organizaciones.findUnique).toHaveBeenCalledWith({ where: { id: 55 } });
    expect(prismaMock.organizaciones.update).toHaveBeenCalledWith({
      where: { id: 55 },
      data: expect.objectContaining({ nombre: 'Org Actualizada', estado: 'suspendido' })
    });
    expect(response.body).toEqual(expect.objectContaining({ id: 55, nombre: 'Org Actualizada', estado: 'suspendido' }));
  });

  it('PUT /organizaciones/:id retorna 404 cuando Prisma no encuentra la entidad', async () => {
    prismaMock.organizaciones.findUnique.mockResolvedValueOnce(null as never);

    await request(app.getHttpServer())
      .put('/organizaciones/9999')
      .send({ nombre: 'Org Fantasma' })
      .expect(404);

    expect(prismaMock.organizaciones.update).not.toHaveBeenCalled();
  });

  it('POST /personas asigna role_id con Prisma', async () => {
    const personaRecord = createPersonaRecord({ id: 501, nombres: 'Laura Prisma' });
    prismaMock.roles.findUnique.mockResolvedValueOnce({ id: 9, role_key: 'ADMIN', name: 'Admin', rank: 1 });
    prismaMock.personas.create.mockResolvedValueOnce(personaRecord);

    const payload = {
      nombres: 'Laura Prisma',
      apellidos: 'Test',
      esRepresentante: true,
      roles: ['ADMIN']
    };

    const response = await request(app.getHttpServer()).post('/personas').send(payload).expect(201);

    expect(prismaMock.roles.findUnique).toHaveBeenCalledWith({ where: { role_key: 'ADMIN' } });
    expect(prismaMock.personas.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        nombres: 'Laura Prisma',
        role_id: 9
      }),
      include: expect.any(Object)
    });
    expect(response.body.roles).toEqual([expect.objectContaining({ key: 'ADMIN' })]);
  });

  it('DELETE /personas/:id elimina usando Prisma', async () => {
    const personaRecord = createPersonaRecord({ id: 321, role_id: 8, roles: { id: 8, role_key: 'MANAGER', name: 'Manager', rank: 10 } });
    prismaMock.personas.findUnique.mockResolvedValueOnce(personaRecord);
    prismaMock.personas.delete.mockResolvedValueOnce(undefined as never);

    await request(app.getHttpServer()).delete('/personas/321').expect(204);

    expect(prismaMock.personas.findUnique).toHaveBeenCalledWith({ where: { id: 321 }, include: expect.any(Object) });
    expect(prismaMock.personas.delete).toHaveBeenCalledWith({ where: { id: 321 } });
  });
});
