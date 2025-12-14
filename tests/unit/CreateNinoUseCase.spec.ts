/**
 * # Create Nino Use Case.spec
 * Propósito: Prueba unitaria Create Nino Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi, afterEach } from 'vitest';
import { ZodError } from 'zod';

import { NinoRepository } from '@/application/repositories/NinoRepository';
import { PeriodoRepository } from '@/application/repositories/PeriodoRepository';
import { CreateNinoUseCase } from '@/application/use-cases/ninos/CreateNinoUseCase';
import * as ninoRules from '@/domain/services/ninoRules';

const buildPayload = () => ({
  nombres: 'Juan',
  apellidos: 'Pérez',
  run: '12345678',
  dv: '9',
  documento: null,
  fecha_nacimiento: new Date('2018-01-01'),
  sexo: 'M',
  organizacionId: 1,
  periodoId: 1,
  providenciaId: null,
  edad: 7,
  tiene_discapacidad: false,
  fecha_ingreso: new Date('2024-01-10'),
  fecha_retiro: null,
  estado: 'registrado'
});

const makeNinoRepository = () => ({
  create: vi.fn()
}) as Pick<NinoRepository, 'create'> as NinoRepository;

const makePeriodoRepository = () => ({
  findById: vi.fn()
}) as Pick<PeriodoRepository, 'findById'> as PeriodoRepository;

describe('CreateNinoUseCase', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('crea un niño válido a través del repositorio', async () => {
    const repository = makeNinoRepository();
    const periodoRepository = makePeriodoRepository();
    periodoRepository.findById.mockResolvedValue({ id: 1, fecha_inicio: new Date('2024-03-01') } as any);
    const useCase = new CreateNinoUseCase(repository, periodoRepository);
    const payload = buildPayload();
    const creado = { ...payload, id: 99 } as any;
    (repository.create as any).mockResolvedValue(creado);

    const result = await useCase.execute(payload);

    expect(repository.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(creado);
  });

  it('inhabilita automáticamente cuando la edad en el periodo es >= máximo', async () => {
    const repository = makeNinoRepository();
    const periodoRepository = makePeriodoRepository();
    const periodoFecha = new Date('2024-03-01');
    periodoRepository.findById.mockResolvedValue({ id: 1, fecha_inicio: periodoFecha } as any);
    const useCase = new CreateNinoUseCase(repository, periodoRepository);
    const payload = buildPayload();

    (repository.create as any).mockResolvedValue({ ...payload, id: 1 });
    const calcularEdadSpy = vi.spyOn(ninoRules, 'calcularEdad');
    calcularEdadSpy.mockReturnValue(ninoRules.MAX_EDAD); // fuerza inhabilitación

    await useCase.execute(payload);

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ estado: 'inhabilitado', fecha_retiro: periodoFecha })
    );
  });

  it('lanza error de validación cuando faltan datos', async () => {
    const repository = makeNinoRepository();
    const periodoRepository = makePeriodoRepository();
    periodoRepository.findById.mockResolvedValue({ id: 1, fecha_inicio: new Date('2024-03-01') } as any);
    const useCase = new CreateNinoUseCase(repository, periodoRepository);

    await expect(
      useCase.execute({ nombres: 'J', apellidos: 'P' })
    ).rejects.toBeInstanceOf(ZodError);
  });
});
