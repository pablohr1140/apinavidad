/**
 * # Prisma User Repository.spec
 * Propósito: Prueba unitaria Prisma User Repository.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaUserRepository } from '@/infra/database/repositories/PrismaUserRepository';

const basePersona = {
  id: 1,
  email: 'user@test.cl',
  password: 'hash',
  roles: {
    id: 5,
    role_key: 'SUPERADMIN',
    name: 'Superadmin',
    rank: 500
  },
  created_at: new Date('2025-01-01'),
  updated_at: new Date('2025-02-01')
};

type PersonaClient = Pick<PrismaService, 'personas'>;

const createPrismaStub = () => {
  const personas = {
    findFirst: vi.fn()
  };

  const service = { personas } as unknown as PersonaClient;

  return { service, personas };
};

describe('PrismaUserRepository', () => {
  let prismaStub: ReturnType<typeof createPrismaStub>;
  let repository: PrismaUserRepository;

  beforeEach(() => {
    prismaStub = createPrismaStub();
    repository = new PrismaUserRepository(prismaStub.service as unknown as PrismaService);
  });

  it('retorna null si no encuentra persona o falta password/email', async () => {
    prismaStub.personas.findFirst.mockResolvedValueOnce(null);
    prismaStub.personas.findFirst.mockResolvedValueOnce({ ...basePersona, password: null });

    const missing = await repository.findByEmail('missing@test.cl');
    const withoutPassword = await repository.findByEmail(basePersona.email);

    expect(missing).toBeNull();
    expect(withoutPassword).toBeNull();
  });

  it('mapea la persona con rol a UserRecord', async () => {
    prismaStub.personas.findFirst.mockResolvedValueOnce(basePersona);

    const user = await repository.findByEmail(basePersona.email);

    expect(prismaStub.personas.findFirst).toHaveBeenCalledWith({
      where: { email: basePersona.email },
      include: { roles: true }
    });
    expect(user).toMatchObject({
      id: 1,
      email: basePersona.email,
      passwordHash: 'hash',
      roles: [{ id: 5, key: 'SUPERADMIN', name: 'Superadmin', rank: 500 }]
    });
  });
});
