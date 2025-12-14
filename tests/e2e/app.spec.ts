/**
 * # app.spec
 * Propósito: Prueba e2e app.spec
 * Pertenece a: Tests (Prueba e2e)
 * Interacciones: Nest app, Supertest/Prisma
 */

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { vi } from 'vitest';

import { AppModule } from '@/app.module';
import { PasetoAuthGuard } from '@/modules/auth/guards/paseto-auth.guard';
import { PermissionsGuard } from '@/modules/auth/guards/permissions.guard';
import { NinosController } from '@/modules/ninos/ninos.controller';
import { OrganizacionesController } from '@/modules/organizaciones/organizaciones.controller';
import { PeriodosController } from '@/modules/periodos/periodos.controller';
import { PersonasController } from '@/modules/personas/personas.controller';
import { ReportesController } from '@/modules/reportes/reportes.controller';

describe('API smoke', () => {
  let app: INestApplication;
  const listPersonasUseCaseMock = { execute: vi.fn() };
  const createPersonaUseCaseMock = { execute: vi.fn() };
  const getPersonaUseCaseMock = { execute: vi.fn() };
  const updatePersonaUseCaseMock = { execute: vi.fn() };
  const deletePersonaUseCaseMock = { execute: vi.fn() };
  const listNinosUseCaseMock = { execute: vi.fn() };
  const createNinoUseCaseMock = { execute: vi.fn() };
  const getNinoUseCaseMock = { execute: vi.fn() };
  const updateNinoUseCaseMock = { execute: vi.fn() };
  const inhabilitarNinoUseCaseMock = { execute: vi.fn() };
  const restaurarNinoUseCaseMock = { execute: vi.fn() };
  const autoInhabilitarNinosUseCaseMock = { execute: vi.fn() };
  const listOrganizacionesUseCaseMock = { execute: vi.fn() };
  const createOrganizacionUseCaseMock = { execute: vi.fn() };
  const updateOrganizacionUseCaseMock = { execute: vi.fn() };
  const deleteOrganizacionUseCaseMock = { execute: vi.fn() };
  const listPeriodosUseCaseMock = { execute: vi.fn() };
  const createPeriodoUseCaseMock = { execute: vi.fn() };
  const updatePeriodoUseCaseMock = { execute: vi.fn() };
  const openPeriodoUseCaseMock = { execute: vi.fn() };
  const closePeriodoUseCaseMock = { execute: vi.fn() };
  const activatePeriodoUseCaseMock = { execute: vi.fn() };
  const listNinosForReportUseCaseMock = listNinosUseCaseMock;

  beforeAll(async () => {
    vi.spyOn(PasetoAuthGuard.prototype, 'canActivate').mockImplementation((context) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 1,
        email: 'test@example.com',
        roles: [
          {
            id: 1,
            key: 'SUPERADMIN',
            name: 'Superadmin',
            rank: 500
          }
        ],
        permissions: new Set()
      };
      return true;
    });
    vi.spyOn(PermissionsGuard.prototype, 'canActivate').mockReturnValue(true);

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const personasController = app.get(PersonasController);
    Object.assign(personasController, {
      listPersonasUseCase: listPersonasUseCaseMock,
      createPersonaUseCase: createPersonaUseCaseMock,
      getPersonaUseCase: getPersonaUseCaseMock,
      updatePersonaUseCase: updatePersonaUseCaseMock,
      deletePersonaUseCase: deletePersonaUseCaseMock
    });

    const ninosController = app.get(NinosController);
    Object.assign(ninosController, {
      listNinosUseCase: listNinosUseCaseMock,
      createNinoUseCase: createNinoUseCaseMock,
      getNinoUseCase: getNinoUseCaseMock,
      updateNinoUseCase: updateNinoUseCaseMock,
      inhabilitarNinoUseCase: inhabilitarNinoUseCaseMock,
      restaurarNinoUseCase: restaurarNinoUseCaseMock,
      autoInhabilitarNinosUseCase: autoInhabilitarNinosUseCaseMock
    });

    const organizacionesController = app.get(OrganizacionesController);
    Object.assign(organizacionesController, {
      listOrganizacionesUseCase: listOrganizacionesUseCaseMock,
      createOrganizacionUseCase: createOrganizacionUseCaseMock,
      updateOrganizacionUseCase: updateOrganizacionUseCaseMock,
      deleteOrganizacionUseCase: deleteOrganizacionUseCaseMock
    });

    const periodosController = app.get(PeriodosController);
    Object.assign(periodosController, {
      listPeriodosUseCase: listPeriodosUseCaseMock,
      createPeriodoUseCase: createPeriodoUseCaseMock,
      updatePeriodoUseCase: updatePeriodoUseCaseMock,
      openPeriodoUseCase: openPeriodoUseCaseMock,
      closePeriodoUseCase: closePeriodoUseCaseMock,
      activatePeriodoUseCase: activatePeriodoUseCaseMock
    });

    const reportesController = app.get(ReportesController);
    Object.assign(reportesController, {
      listNinosUseCase: listNinosForReportUseCaseMock
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    listPersonasUseCaseMock.execute.mockResolvedValue([
      {
        id: 1,
        nombres: 'Ana',
        apellidos: 'Perez'
      }
    ]);
    listNinosUseCaseMock.execute.mockResolvedValue([]);
    getNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 99, nombres: 'Mock' });
    updateNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 99, estado: 'validado' });
    inhabilitarNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 99, estado: 'inhabilitado' });
    restaurarNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 99, estado: 'registrado' });
    autoInhabilitarNinosUseCaseMock.execute = vi.fn().mockResolvedValue({ afectados: 3 });
    listOrganizacionesUseCaseMock.execute.mockResolvedValue([]);
    updateOrganizacionUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, estado: 'suspendido' });
    deleteOrganizacionUseCaseMock.execute = vi.fn().mockResolvedValue(undefined);
    listPeriodosUseCaseMock.execute.mockResolvedValue([]);
    createPeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1 });
    updatePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, estado_periodo: 'abierto' });
    openPeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, estado_periodo: 'abierto' });
    closePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, estado_periodo: 'cerrado' });
    activatePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, es_activo: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it('health check', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('lists personas', async () => {
    const response = await request(app.getHttpServer()).get('/personas').expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        id: 1,
        nombres: 'Ana',
        apellidos: 'Perez'
      })
    ]);
    expect(listPersonasUseCaseMock.execute).toHaveBeenCalledWith({ organizacionId: undefined, search: undefined });
  });

  it('crea una persona con datos válidos', async () => {
    const body = {
      nombres: 'Carlos',
      apellidos: 'López',
      run: '12345678',
      dv: '9',
      fecha_nacimiento: '1990-01-01',
      sexo: 'M'
    };
    createPersonaUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 2, ...body });

    const response = await request(app.getHttpServer()).post('/personas').send(body).expect(201);

    expect(response.body).toEqual(expect.objectContaining({ id: 2, nombres: 'Carlos' }));
    expect(createPersonaUseCaseMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({ nombres: 'Carlos', apellidos: 'López' })
    );
  });

  it('actualiza una persona existente', async () => {
    const body = { email: 'ana@example.com' };
    updatePersonaUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 1, ...body });

    const response = await request(app.getHttpServer()).put('/personas/1').send(body).expect(200);

    expect(response.body).toEqual(expect.objectContaining(body));
    expect(updatePersonaUseCaseMock.execute).toHaveBeenCalledWith(1, body);
  });

  it('elimina una persona y retorna 204', async () => {
    deletePersonaUseCaseMock.execute = vi.fn().mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/personas/1').expect(204);

    expect(deletePersonaUseCaseMock.execute).toHaveBeenCalledWith(1, expect.objectContaining({ id: 1 }));
  });

  it('lista ninos aplicando conversión de filtros', async () => {
    listNinosUseCaseMock.execute.mockResolvedValue([
      {
        id: 10,
        nombres: 'Mateo'
      }
    ]);

    const response = await request(app.getHttpServer())
      .get('/ninos?periodoId=2&organizacionId=abc&estado=validado')
      .expect(200);

    expect(listNinosUseCaseMock.execute).toHaveBeenCalledWith({ periodoId: 2, organizacionId: undefined, estado: 'validado' });
    expect(response.body).toEqual([
      expect.objectContaining({ id: 10, nombres: 'Mateo' })
    ]);
  });

  it('crea un nino y delega en el use case', async () => {
    const body = {
      nombres: 'Juan',
      apellidos: 'Lopez',
      run: '12345678',
      dv: '9',
      fecha_nacimiento: '2018-01-01',
      sexo: 'M',
      organizacionId: 1,
      periodoId: 1,
      edad: 7,
      fecha_ingreso: '2024-01-10',
      estado: 'registrado',
      tiene_discapacidad: false,
      requiere_apoyo: false
    } as any;
    createNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 5, ...body });

    const response = await request(app.getHttpServer()).post('/ninos').send(body).expect(201);

    expect(createNinoUseCaseMock.execute).toHaveBeenCalledWith(expect.objectContaining({ nombres: 'Juan', apellidos: 'Lopez' }));
    expect(response.body).toEqual(expect.objectContaining({ id: 5 }));
  });

  it('obtiene un nino por id', async () => {
    getNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 7, nombres: 'Lia' });

    const response = await request(app.getHttpServer()).get('/ninos/7').expect(200);

    expect(getNinoUseCaseMock.execute).toHaveBeenCalledWith(7);
    expect(response.body).toEqual(expect.objectContaining({ id: 7 }));
  });

  it('actualiza un nino', async () => {
    const body = { estado: 'validado' };
    updateNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 9, ...body });

    const response = await request(app.getHttpServer()).put('/ninos/9').send(body).expect(200);

    expect(updateNinoUseCaseMock.execute).toHaveBeenCalledWith(9, body);
    expect(response.body).toEqual(expect.objectContaining(body));
  });

  it('inhabilita un nino', async () => {
    const body = { fecha: '2025-01-01', motivo: 'edad' };
    inhabilitarNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 5, estado: 'inhabilitado' });

    const response = await request(app.getHttpServer()).post('/ninos/5/inhabilitar').send(body).expect(201);

    expect(inhabilitarNinoUseCaseMock.execute).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ motivo: 'edad', fecha: expect.any(Date) })
    );
    expect(response.body.estado).toBe('inhabilitado');
  });

  it('restaura un nino', async () => {
    restaurarNinoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 5, estado: 'registrado' });

    const response = await request(app.getHttpServer()).post('/ninos/5/restaurar').expect(201);

    expect(restaurarNinoUseCaseMock.execute).toHaveBeenCalledWith(5);
    expect(response.body.estado).toBe('registrado');
  });

  it('auto inhabilita ninos', async () => {
    autoInhabilitarNinosUseCaseMock.execute = vi.fn().mockResolvedValue({ afectados: 4 });

    const response = await request(app.getHttpServer())
      .post('/ninos/auto-inhabilitar')
      .send({ fechaReferencia: '2025-01-01', dryRun: true })
      .expect(201);

    expect(autoInhabilitarNinosUseCaseMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({ fechaReferencia: expect.any(Date), dryRun: true })
    );
    expect(response.body.afectados).toBe(4);
  });

  it('actualiza una organización', async () => {
    updateOrganizacionUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 5, estado: 'suspendido' });
    const body = { estado: 'suspendido' };

    const response = await request(app.getHttpServer()).put('/organizaciones/5').send(body).expect(200);

    expect(updateOrganizacionUseCaseMock.execute).toHaveBeenCalledWith(5, body);
    expect(response.body).toEqual(expect.objectContaining(body));
  });

  it('elimina una organización', async () => {
    deleteOrganizacionUseCaseMock.execute = vi.fn().mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/organizaciones/5').expect(204);

    expect(deleteOrganizacionUseCaseMock.execute).toHaveBeenCalledWith(5);
  });

  it('lista organizaciones con filtros opcionales', async () => {
    listOrganizacionesUseCaseMock.execute.mockResolvedValue([
      { id: 1, nombre: 'Fundacion Uno', estado: 'activo' }
    ]);

    const response = await request(app.getHttpServer())
      .get('/organizaciones?estado=activo&tipo=ong')
      .expect(200);

    expect(listOrganizacionesUseCaseMock.execute).toHaveBeenCalledWith({ estado: 'activo', tipo: 'ong' });
    expect(response.body).toEqual([
      expect.objectContaining({ nombre: 'Fundacion Uno' })
    ]);
  });

  it('crea una organizacion', async () => {
    const body = {
      nombre: 'Fundacion Dos',
      tipo: 'ong',
      estado: 'activo'
    };
    createOrganizacionUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 3, ...body });

    const response = await request(app.getHttpServer()).post('/organizaciones').send(body).expect(201);

    expect(createOrganizacionUseCaseMock.execute).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Fundacion Dos' }));
    expect(response.body).toEqual(expect.objectContaining({ id: 3 }));
  });

  it('lista periodos convirtiendo activo a booleano', async () => {
    listPeriodosUseCaseMock.execute.mockResolvedValue([{ id: 1, estado_periodo: 'abierto' }]);

    const response = await request(app.getHttpServer()).get('/periodos?estado=abierto&activo=true').expect(200);

    expect(listPeriodosUseCaseMock.execute).toHaveBeenCalledWith({ estado: 'abierto', activo: true });
    expect(response.body).toEqual([expect.objectContaining({ estado_periodo: 'abierto' })]);
  });

  it('crea un periodo', async () => {
    const payload = {
      nombre: '2025-I',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      estado_periodo: 'planificado',
      es_activo: false
    };
    createPeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 2, ...payload });

    const response = await request(app.getHttpServer()).post('/periodos').send(payload).expect(201);

    expect(createPeriodoUseCaseMock.execute).toHaveBeenCalledWith(expect.objectContaining({ nombre: '2025-I' }));
    expect(response.body.id).toBe(2);
  });

  it('actualiza un periodo existente', async () => {
    const body = { estado_periodo: 'abierto' };
    updatePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 3, ...body });

    const response = await request(app.getHttpServer()).put('/periodos/3').send(body).expect(200);

    expect(updatePeriodoUseCaseMock.execute).toHaveBeenCalledWith(3, body);
    expect(response.body).toEqual(expect.objectContaining(body));
  });

  it('abre, cierra y activa un periodo', async () => {
    openPeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 4, estado_periodo: 'abierto' });
    closePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 4, estado_periodo: 'cerrado' });
    activatePeriodoUseCaseMock.execute = vi.fn().mockResolvedValue({ id: 4, es_activo: true });

    await request(app.getHttpServer()).post('/periodos/4/open').expect(201);
    await request(app.getHttpServer()).post('/periodos/4/close').expect(201);
    const activateResponse = await request(app.getHttpServer()).post('/periodos/4/activate').expect(201);

    expect(openPeriodoUseCaseMock.execute).toHaveBeenCalledWith(4);
    expect(closePeriodoUseCaseMock.execute).toHaveBeenCalledWith(4);
    expect(activatePeriodoUseCaseMock.execute).toHaveBeenCalledWith(4);
    expect(activateResponse.body.es_activo).toBe(true);
  });

  it('reporta ninos inhabilitados con totales', async () => {
    listNinosForReportUseCaseMock.execute.mockResolvedValue([
      { id: 1, estado: 'inhabilitado' },
      { id: 2, estado: 'inhabilitado' }
    ]);

    const response = await request(app.getHttpServer()).get('/reportes/ninos/inhabilitados').expect(200);

    expect(listNinosForReportUseCaseMock.execute).toHaveBeenCalledWith({ estado: 'inhabilitado' });
    expect(response.body.total).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });

  it('listado de reportes calcula edad y tiempo restante', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2025-01-01'));
    listNinosForReportUseCaseMock.execute.mockResolvedValue([
      {
        id: 10,
        nombres: 'Mia',
        fecha_nacimiento: new Date('2018-01-15')
      }
    ]);

    const response = await request(app.getHttpServer())
      .get('/reportes/ninos/listado?periodoId=4&organizacionId=invalid&estado=validado')
      .expect(200);

    vi.useRealTimers();

    expect(listNinosForReportUseCaseMock.execute).toHaveBeenCalledWith({ periodoId: 4, organizacionId: undefined, estado: 'validado' });
    expect(response.body.total).toBe(1);
    expect(response.body.data[0]).toEqual(
      expect.objectContaining({
        id: 10,
        edad_calculada: 6,
        tiempo_para_inhabilitar: 4
      })
    );
  });
});
