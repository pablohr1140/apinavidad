import { ArgumentsHost, Catch, ExceptionFilter, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { beforeAll, afterAll, beforeEach, describe, it, expect, vi } from 'vitest';

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

const runPrismaSqlServer = String(process.env.RUN_PRISMA_SQLSERVER_TESTS ?? '').toLowerCase();
const describeIf = runPrismaSqlServer === 'false' ? describe.skip : describe;

interface SeededData {
  roleId: number;
  roleKey: string;
  organizacionId: number;
  organizacionNombre: string;
  personaId: number;
  personaEmail: string;
  personaApellido: string;
  searchTerm: string;
}

@Catch()
class LogAllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Unhandled exception filter', exception);
    throw exception;
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('UnhandledRejection', reason);
});

process.on('uncaughtException', (error) => {
  console.error('UncaughtException', error);
});

describeIf('Prisma read integration (SQL Server real)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let seeded: SeededData;
  let pasetoGuardSpy: ReturnType<typeof vi.spyOn>;
  let permissionsGuardSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    seeded = await seedPrismaFixtures(prisma);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(OrganizacionRepository)
      .useFactory({
        factory: (prismaService: PrismaService) => new PrismaOrganizacionRepository(prismaService),
        inject: [PrismaService]
      })
      .overrideProvider(PersonaRepository)
      .useFactory({
        factory: (prismaService: PrismaService) => new PrismaPersonaRepository(prismaService),
        inject: [PrismaService]
      })
      .compile();

    pasetoGuardSpy = vi.spyOn(PasetoAuthGuard.prototype, 'canActivate').mockImplementation(async (context) => {
      const req = context.switchToHttp().getRequest();
      req.user = {
        id: 1,
        email: 'prisma-real@test.cl',
        roles: [{ id: 1, key: 'SUPERADMIN', name: 'Superadmin', rank: 500 }],
        permissions: new Set()
      };
      return true;
    });
    permissionsGuardSpy = vi.spyOn(PermissionsGuard.prototype, 'canActivate').mockResolvedValue(true);

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new LogAllExceptionsFilter());
    await app.init();

    const prismaService = app.get(PrismaService);
    const prismaOrganizacionRepository = new PrismaOrganizacionRepository(prismaService);
    const prismaPersonaRepository = new PrismaPersonaRepository(prismaService);

    const listOrganizacionesUseCase = new ListOrganizacionesUseCase(prismaOrganizacionRepository);
    const getOrganizacionUseCase = new GetOrganizacionUseCase(prismaOrganizacionRepository);
    const listPersonasUseCase = new ListPersonasUseCase(prismaPersonaRepository);
    const getPersonaUseCase = new GetPersonaUseCase(prismaPersonaRepository);

    const organizacionesController = app.get(OrganizacionesController);
    Object.assign(organizacionesController, {
      listOrganizacionesUseCase,
      getOrganizacionUseCase
    });

    const personasController = app.get(PersonasController);
    Object.assign(personasController, {
      listPersonasUseCase,
      getPersonaUseCase
    });
  });

  afterAll(async () => {
    await app?.close();
    pasetoGuardSpy?.mockRestore();
    permissionsGuardSpy?.mockRestore();

    await prisma.organizacion_persona.deleteMany({
      where: { persona_id: seeded.personaId, organizacion_id: BigInt(seeded.organizacionId) }
    });
    await prisma.personas.deleteMany({ where: { id: seeded.personaId } });
    await prisma.organizaciones.deleteMany({ where: { id: BigInt(seeded.organizacionId) } });
    await prisma.roles.deleteMany({ where: { id: seeded.roleId } });

    await prisma.$disconnect();
  });

  beforeEach(() => {
    pasetoGuardSpy.mockClear();
    permissionsGuardSpy.mockClear();
  });

  it('GET /organizaciones?estado=activo devuelve la organización sembrada', async () => {
    const repo = app.get(OrganizacionRepository);
    try {
      await repo.findMany({ estado: 'activo' });
    } catch (error) {
      console.error('Direct repo.findMany error', error);
    }

    const response = await request(app.getHttpServer()).get('/organizaciones?estado=activo');
    if (response.status !== 200) {
      // Ayuda de debug para ver errores del endpoint en CI
      console.error('GET /organizaciones error', response.status, response.body);
    }
    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seeded.organizacionId,
          nombre: seeded.organizacionNombre,
          estado: 'activo'
        })
      ])
    );
  });

  it('GET /organizaciones/:id retorna datos reales desde Prisma', async () => {
    const repo = app.get(OrganizacionRepository);
    try {
      await repo.findById(seeded.organizacionId);
    } catch (error) {
      console.error('Direct repo.findById error', error);
    }

    const response = await request(app.getHttpServer()).get(`/organizaciones/${seeded.organizacionId}`);
    if (response.status !== 200) {
      console.error('GET /organizaciones/:id error', response.status, response.body);
    }
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      id: seeded.organizacionId,
      nombre: seeded.organizacionNombre,
      estado: 'activo'
    });
  });

  it('GET /personas?organizacionId filtra y adjunta roles', async () => {
    const response = await request(app.getHttpServer())
      .get(`/personas?organizacionId=${seeded.organizacionId}&search=${encodeURIComponent(seeded.searchTerm)}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seeded.personaId,
          apellidos: seeded.personaApellido,
          roles: expect.arrayContaining([expect.objectContaining({ key: seeded.roleKey })])
        })
      ])
    );
  });

  it('GET /personas/:id responde con datos reales y roles Prisma', async () => {
    const response = await request(app.getHttpServer()).get(`/personas/${seeded.personaId}`).expect(200);

    expect(response.body).toMatchObject({
      id: seeded.personaId,
      email: seeded.personaEmail
    });
    expect(response.body.roles).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: seeded.roleKey, rank: expect.any(Number) })])
    );
  });
});

async function seedPrismaFixtures(prisma: PrismaClient): Promise<SeededData> {
  const timestamp = Date.now();
  const suffix = `prisma-real-${timestamp}`;

  const role = await prisma.roles.create({
    data: {
      role_key: `PRISMA_REAL_${timestamp}`,
      name: `Prisma Real ${timestamp}`,
      rank: 200
    }
  });

  const organizacion = await prisma.organizaciones.create({
    data: {
      nombre: `Organización Prisma Real ${suffix}`,
      tipo: 'ONG',
      estado: 'activo',
      email: `org-${suffix}@example.com`,
      telefono: '+56 2 1234 5678'
    }
  });

  const persona = await prisma.personas.create({
    data: {
      nombres: 'Laura',
      apellidos: `Tester ${suffix}`,
      email: `laura.${suffix}@example.com`,
      es_representante: true,
      role_id: role.id
    }
  });

  await prisma.organizacion_persona.create({
    data: {
      organizacion_id: organizacion.id,
      persona_id: persona.id,
      es_principal: true,
      es_reserva: false
    }
  });

  const organizacionId = Number(organizacion.id);

  return {
    roleId: role.id,
    roleKey: role.role_key,
    organizacionId,
    organizacionNombre: organizacion.nombre,
    personaId: persona.id,
    personaEmail: persona.email ?? '',
    personaApellido: persona.apellidos,
    searchTerm: `Tester ${suffix}`
  };
}
