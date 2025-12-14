/**
 * # Prisma Log Repository.spec
 * Propósito: Prueba unitaria Prisma Log Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaLogRepository } from '@/infra/database/repositories/PrismaLogRepository';

const baseLog = {
  id: 1,
  user_id: 2,
  accion: 'CREATE',
  mensaje: 'creado',
  loggable_id: BigInt(10),
  loggable_type: 'ninos',
  payload: JSON.stringify({ foo: 'bar' }),
  ip: '127.0.0.1',
  user_agent: 'test',
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-01-02')
};

type LogClient = Pick<PrismaService, 'logs'>;

const createPrismaStub = () => {
  const logs = {
    create: vi.fn()
  };

  const service = { logs } as unknown as LogClient;

  return { service, logs };
};

describe('PrismaLogRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaLogRepository;

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaLogRepository(prismaStub.service as unknown as PrismaService);
  });

  it('serializa payload al crear', async () => {
    prismaStub.logs.create.mockResolvedValueOnce(baseLog);

    await repository.create({
      personaId: 2,
      accion: 'CREATE',
      mensaje: 'creado',
      loggableId: 10,
      loggableType: 'ninos',
      payload: { foo: 'bar' },
      ip: '127.0.0.1',
      user_agent: 'test'
    });

    expect(prismaStub.logs.create).toHaveBeenCalledWith({
      data: {
        user_id: 2,
        accion: 'CREATE',
        mensaje: 'creado',
        loggable_id: BigInt(10),
        loggable_type: 'ninos',
        payload: JSON.stringify({ foo: 'bar' }),
        ip: '127.0.0.1',
        user_agent: 'test'
      }
    });
  });

  it('parsea payload y bigints al retornar dominio', async () => {
    prismaStub.logs.create.mockResolvedValueOnce(baseLog);

    const log = await repository.create({
      personaId: 2,
      accion: 'CREATE',
      mensaje: 'creado',
      loggableId: 10,
      loggableType: 'ninos'
    });

    expect(log).toMatchObject({
      id: 1,
      personaId: 2,
      loggableId: 10,
      payload: { foo: 'bar' }
    });
  });
});
