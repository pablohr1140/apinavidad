/**
 * # prisma read.spec
 * Propósito: Prueba e2e prisma read.spec
 * Pertenece a: Tests (Prueba e2e)
 * Interacciones: Nest app, Supertest/Prisma
 */

import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { vi, describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest';

import { AppModule } from '@/app.module';
import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { GetOrganizacionUseCase } from '@/application/use-cases/organizaciones/GetOrganizacionUseCase';
import { ListOrganizacionesUseCase } from '@/application/use-cases/organizaciones/ListOrganizacionesUseCase';
import { GetPersonaUseCase } from '@/application/use-cases/personas/GetPersonaUseCase';
import { ListPersonasUseCase } from '@/application/use-cases/personas/ListPersonasUseCase';
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
  organizacion_persona: unknown[];
  created_at: Date;
  updated_at: Date;
}

const createOrganizacionRecord = (overrides: Partial<OrganizacionRecord> = {}): OrganizacionRecord => ({
  id: 1,
  nombre: 'Organización Prisma',
  sigla: null,
  rut: null,
  tipo: 'ONG',
  direccion: null,
  telefono: null,
  email: 'contacto@prisma.cl',
  providencia_id: 10,
  estado: 'activo',
  created_at: new Date('2024-01-01T00:00:00Z'),
  updated_at: new Date('2024-01-02T00:00:00Z'),
  ...overrides
});

const createPersonaRecord = (overrides: Partial<PersonaRecord> = {}): PersonaRecord => ({
  id: 50,
  nombres: 'Laura',
  apellidos: 'Gomez',
  run: '12345678',
  dv: '9',
  fecha_nacimiento: new Date('1995-01-01T00:00:00Z'),
  sexo: 'F',
  telefono: '+56 9 1234 5678',
  email: 'laura@example.com',
  email_verified_at: null,
  password: null,
  remember_token: null,
  direccion: 'Av. Prisma 123',
  providencia_id: 10,
  es_representante: true,
  role_id: 9,
  roles: { id: 9, role_key: 'ADMIN', name: 'Admin', rank: 1 },
  created_at: new Date('2024-03-01T00:00:00Z'),
  updated_at: new Date('2024-03-02T00:00:00Z'),
  organizacion_persona: [],
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
    findMany: vi.fn()
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

const resetPrismaMockFns = () => {
  const resetGroup = (group: Record<string, ReturnType<typeof vi.fn>>) => {
    Object.values(group).forEach((mockFn) => mockFn.mockReset());
  };

  resetGroup(prismaMock.organizaciones);
  resetGroup(prismaMock.personas);
  resetGroup(prismaMock.roles);
};

describe('Prisma read integration', () => {
  let app: INestApplication;
  let pasetoGuardSpy: ReturnType<typeof vi.spyOn>;
  let permissionsGuardSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(async () => {
    process.env.NODE_ENV ??= 'test';

    pasetoGuardSpy = vi.spyOn(PasetoAuthGuard.prototype, 'canActivate').mockImplementation(async (context) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 1,
        email: 'prisma@test.cl',
        roles: [{ id: 1, key: 'SUPERADMIN', name: 'Superadmin', rank: 500 }],
        permissions: new Set()
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
    const listOrganizacionesUseCase = new ListOrganizacionesUseCase(prismaOrganizacionRepository);
    const getOrganizacionUseCase = new GetOrganizacionUseCase(prismaOrganizacionRepository);
    const listPersonasUseCase = new ListPersonasUseCase(prismaPersonaRepository);
    const getPersonaUseCase = new GetPersonaUseCase(prismaPersonaRepository);

    const organizacionesController = app.get(OrganizacionesController);
    const personasController = app.get(PersonasController);

    Object.assign(organizacionesController, {
      listOrganizacionesUseCase,
      getOrganizacionUseCase
    });

    Object.assign(personasController, {
      listPersonasUseCase,
      getPersonaUseCase
    });
  });

  afterAll(async () => {
    await app.close();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    resetPrismaMockFns();
    pasetoGuardSpy.mockClear();
    permissionsGuardSpy.mockClear();
  });

  it('resuelve los repositorios Prisma', () => {
    const organizacionRepository = app.get(OrganizacionRepository);
    const personaRepository = app.get(PersonaRepository);

    expect(organizacionRepository).toBeInstanceOf(PrismaOrganizacionRepository);
    expect(personaRepository).toBeInstanceOf(PrismaPersonaRepository);
  });

  it('GET /organizaciones usa Prisma para filtrar y mapear datos', async () => {
    const record = createOrganizacionRecord({ id: 77, nombre: 'Fundación Prisma', estado: 'activo' });
    prismaMock.organizaciones.findMany.mockResolvedValueOnce([record]);

    const response = await request(app.getHttpServer()).get('/organizaciones?estado=activo').expect(200);

    expect(prismaMock.organizaciones.findMany).toHaveBeenCalledWith({
      where: { estado: 'activo' },
      orderBy: { created_at: 'desc' }
    });
    expect(response.body).toEqual([
      expect.objectContaining({ id: 77, nombre: 'Fundación Prisma', estado: 'activo' })
    ]);
  });

  it('GET /organizaciones aplica trim en filtros estado/tipo', async () => {
    const record = createOrganizacionRecord({ id: 81, nombre: 'Org Trim' });
    prismaMock.organizaciones.findMany.mockResolvedValueOnce([record]);

    const response = await request(app.getHttpServer())
      .get('/organizaciones?estado=%20activo%20&tipo=%20ONG%20')
      .expect(200);

    expect(prismaMock.organizaciones.findMany).toHaveBeenCalledWith({
      where: { estado: 'activo', tipo: 'ONG' },
      orderBy: { created_at: 'desc' }
    });
    expect(response.body[0]).toEqual(expect.objectContaining({ id: 81, nombre: 'Org Trim' }));
  });

  it('GET /organizaciones/:id obtiene la entidad desde Prisma', async () => {
    const record = createOrganizacionRecord({ id: 90, nombre: 'Org 90' });
    prismaMock.organizaciones.findUnique
      .mockResolvedValueOnce(record);

    const response = await request(app.getHttpServer()).get('/organizaciones/90').expect(200);

    expect(prismaMock.organizaciones.findUnique).toHaveBeenCalledWith({ where: { id: 90 } });
    expect(response.body).toEqual(expect.objectContaining({ id: 90, nombre: 'Org 90' }));
  });

  it('GET /organizaciones/:id retorna 404 cuando Prisma no encuentra datos', async () => {
    prismaMock.organizaciones.findUnique.mockResolvedValueOnce(null as never);

    await request(app.getHttpServer()).get('/organizaciones/321').expect(404);

    expect(prismaMock.organizaciones.findUnique).toHaveBeenCalledWith({ where: { id: 321 } });
  });

  it('GET /personas aplica filtros y retorna roles desde Prisma', async () => {
    const personaRecord = createPersonaRecord({ id: 66, nombres: 'Ana Prisma' });
    prismaMock.personas.findMany.mockResolvedValueOnce([personaRecord]);

    const response = await request(app.getHttpServer()).get('/personas?organizacionId=5&search=%20Ana%20').expect(200);

    expect(prismaMock.personas.findMany).toHaveBeenCalledWith({
      where: {
        organizacion_persona: { some: { organizacion_id: 5 } },
        OR: [
          { nombres: expect.objectContaining({ contains: 'Ana' }) },
          { apellidos: expect.objectContaining({ contains: 'Ana' }) },
          { run: expect.objectContaining({ contains: 'Ana' }) }
        ]
      },
      include: expect.any(Object),
      orderBy: { created_at: 'desc' }
    });
    expect(response.body[0]).toEqual(
      expect.objectContaining({ id: 66, nombres: 'Ana Prisma', roles: [expect.objectContaining({ key: 'ADMIN' })] })
    );
  });

  it('GET /personas/:id usa Prisma.findUnique', async () => {
    const personaRecord = createPersonaRecord({ id: 99, nombres: 'Persona Única' });
    prismaMock.personas.findUnique.mockResolvedValueOnce(personaRecord);

    const response = await request(app.getHttpServer()).get('/personas/99').expect(200);

    expect(prismaMock.personas.findUnique).toHaveBeenCalledWith({ where: { id: 99 }, include: expect.any(Object) });
    expect(response.body).toEqual(expect.objectContaining({ id: 99, nombres: 'Persona Única' }));
  });

  it('GET /personas/:id retorna 404 cuando Prisma no encuentra datos', async () => {
    prismaMock.personas.findUnique.mockResolvedValueOnce(null as never);

    await request(app.getHttpServer()).get('/personas/12345').expect(404);

    expect(prismaMock.personas.findUnique).toHaveBeenCalledWith({ where: { id: 12345 }, include: expect.any(Object) });
  });
});
