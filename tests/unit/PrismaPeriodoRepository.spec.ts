/**
 * # Prisma Periodo Repository.spec
 * Propósito: Prueba unitaria Prisma Periodo Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPeriodoRepository } from '@/infra/database/repositories/PrismaPeriodoRepository';

const baseRecord = {
  id: 1,
  nombre: '2025-A',
  fecha_inicio: new Date('2025-01-01'),
  fecha_fin: new Date('2025-12-31'),
  estado_periodo: 'abierto',
  es_activo: true
};

type PeriodoClient = Pick<PrismaService, 'periodos' | '$transaction'>;

const createPrismaStub = () => {
  const periodos = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  };

  const tx = {
    periodos: {
      updateMany: vi.fn(),
      update: vi.fn()
    }
  };

  const service = {
    periodos,
    $transaction: vi.fn(async (cb) => cb(tx as unknown as PrismaService))
  } as unknown as PeriodoClient;

  return { service, periodos, tx };
};

describe('PrismaPeriodoRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaPeriodoRepository;

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaPeriodoRepository(prismaStub.service as unknown as PrismaService);
  });

  it('findMany aplica filtros de estado y activo', async () => {
    prismaStub.periodos.findMany.mockResolvedValueOnce([baseRecord]);

    const result = await repository.findMany({ estado: 'abierto', activo: true });

    expect(prismaStub.periodos.findMany).toHaveBeenCalledWith({
      where: { estado_periodo: 'abierto', es_activo: true },
      orderBy: { created_at: 'desc' }
    });
    expect(result[0]).toMatchObject({ nombre: '2025-A', es_activo: true });
  });

  it('create mapea campos opcionales a null', async () => {
    prismaStub.periodos.create.mockResolvedValueOnce(baseRecord);

    await repository.create({
      nombre: '2026-A',
      fecha_inicio: undefined,
      fecha_fin: undefined,
      estado_periodo: 'borrador',
      es_activo: false
    });

    expect(prismaStub.periodos.create).toHaveBeenCalledWith({
      data: {
        nombre: '2026-A',
        fecha_inicio: null,
        fecha_fin: null,
        estado_periodo: 'borrador',
        es_activo: false
      }
    });
  });

  it('open cierra otros abiertos y activa el periodo', async () => {
    prismaStub.tx.periodos.update.mockResolvedValueOnce({ ...baseRecord, id: 42 });

    const result = await repository.open(42);

    expect(prismaStub.service.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaStub.tx.periodos.updateMany).toHaveBeenCalledWith({
      where: { id: { not: 42 }, estado_periodo: 'abierto' },
      data: { estado_periodo: 'cerrado', es_activo: false }
    });
    expect(prismaStub.tx.periodos.update).toHaveBeenCalledWith({
      where: { id: 42 },
      data: { estado_periodo: 'abierto', es_activo: true }
    });
    expect(result).toMatchObject({ id: 42, estado_periodo: 'abierto', es_activo: true });
  });

  it('activate desactiva todos y activa el solicitado en una sola transaccion', async () => {
    prismaStub.tx.periodos.update.mockResolvedValueOnce({ ...baseRecord, id: 99 });

    const result = await repository.activate(99);

    expect(prismaStub.service.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaStub.tx.periodos.updateMany).toHaveBeenCalledWith({ data: { es_activo: false, estado_periodo: 'cerrado' }, where: { id: { not: 99 } } });
    expect(prismaStub.tx.periodos.update).toHaveBeenCalledWith({ where: { id: 99 }, data: { es_activo: true, estado_periodo: 'abierto' } });
    expect(result).toMatchObject({ id: 99, es_activo: true, estado_periodo: 'abierto' });
  });
});
