import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaNinoRepository } from '@/infra/database/repositories/PrismaNinoRepository';
import { AppError } from '@/shared/errors/AppError';
import { MAX_EDAD } from '@/domain/services/ninoRules';

const baseRecord = {
  id: BigInt(10),
  nombres: 'Ana',
  apellidos: 'Perez',
  documento_numero: '12345678-9',
  tipo_documento_id: 1,
  nacionalidad_id: null,
  persona_registro_id: null,
  fecha_nacimiento: new Date('2000-01-01'),
  sexo: 'F',
  organizacion_id: BigInt(2),
  periodo_id: 1,
  edad: 10,
  tiene_discapacidad: false,
  fecha_ingreso: new Date('2020-01-01'),
  fecha_retiro: null,
  estado: true
} satisfies Prisma.ninosUncheckedCreateInput & { id: bigint };

type PrismaNinoClient = Pick<PrismaService, 'ninos' | '$transaction'>;

const createPrismaStub = () => {
  const ninos = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  };

  const tx = {
    ninos: { update: vi.fn() }
  } as unknown as PrismaService;

  const service = {
    ninos,
    $transaction: vi.fn(async (cb) => cb(tx))
  } as unknown as PrismaNinoClient;

  return { service, ninos, tx };
};

describe('PrismaNinoRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaNinoRepository;

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaNinoRepository(prismaStub.service as unknown as PrismaService);
  });

  it('findMany aplica filtros basicos y orden', async () => {
    prismaStub.ninos.findMany.mockResolvedValueOnce([baseRecord]);

    const result = await repository.findMany({
      periodoId: 1,
      organizacionId: 2,
      estado: true,
      edadMin: 5,
      edadMax: 12
    });

    expect(prismaStub.ninos.findMany).toHaveBeenCalledWith({
      where: {
        periodo_id: 1,
        organizacion_id: BigInt(2),
        estado: true,
        edad: { gte: 5, lte: 12 }
      },
      orderBy: { created_at: 'desc' }
    });
    expect(result[0]).toMatchObject({ id: 10, organizacionId: 2, periodoId: 1 });
  });

  it('inhabilitar lanza AppError cuando no encuentra al niño', async () => {
    prismaStub.ninos.findUnique.mockResolvedValueOnce(null);

    await expect(repository.inhabilitar(99, { fecha: new Date(), motivo: 'test' })).rejects.toBeInstanceOf(AppError);
  });

  it('inhabilitar valida que la fecha no sea anterior al ingreso', async () => {
    prismaStub.ninos.findUnique.mockResolvedValueOnce({ ...baseRecord, fecha_ingreso: new Date('2024-01-10') });

    await expect(
      repository.inhabilitar(10, { fecha: new Date('2024-01-01'), motivo: 'invalida' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('autoInhabilitar retorna dry-run sin ejecutar transaccion', async () => {
    const mayorDeEdad = { ...baseRecord, id: BigInt(11), fecha_nacimiento: new Date('1900-01-01') };
    prismaStub.ninos.findMany.mockResolvedValueOnce([mayorDeEdad]);

    const result = await repository.autoInhabilitar(new Date(), true);

    expect(result.afectados).toBe(1);
    expect(prismaStub.service.$transaction).not.toHaveBeenCalled();
  });

  it('autoInhabilitar ejecuta transaccion y actualiza elegibles', async () => {
    const candidato = { ...baseRecord, id: BigInt(12), fecha_nacimiento: new Date('2000-01-01') };
    prismaStub.ninos.findMany.mockResolvedValueOnce([candidato]);

    const result = await repository.autoInhabilitar(new Date(`20${MAX_EDAD + 1}-01-01`));

    expect(result.afectados).toBe(1);
    expect(prismaStub.service.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaStub.tx.ninos.update).toHaveBeenCalledWith({
      where: { id: BigInt(12) },
      data: expect.objectContaining({ estado: false })
    });
  });
});
