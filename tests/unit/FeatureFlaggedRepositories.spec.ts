/**
 * # Feature Flagged Repositories.spec
 * Propósito: Prueba unitaria Feature Flagged Repositories.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import type { PersonaCreateInput, PersonaUpdateInput, PersonaRepository } from '@/application/repositories/PersonaRepository';
import type { OrganizacionProps, PersonaProps } from '@/domain/entities';
import { FeatureFlaggedOrganizacionRepository } from '@/infra/database/repositories/FeatureFlaggedOrganizacionRepository';
import { FeatureFlaggedPersonaRepository } from '@/infra/database/repositories/FeatureFlaggedPersonaRepository';

const createRepoStub = <T>() => ({
  findMany: vi.fn<[], Promise<T[]>>(),
  findById: vi.fn<[], Promise<T | null>>(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
});

describe('FeatureFlaggedOrganizacionRepository', () => {
  let prismaStub: ReturnType<typeof createRepoStub<OrganizacionProps>>;

  beforeEach(() => {
    prismaStub = createRepoStub<OrganizacionProps>();
  });

  it('delegates lecturas y escrituras a Prisma', async () => {
    const repository = new FeatureFlaggedOrganizacionRepository(prismaStub as unknown as OrganizacionRepository);

    const createPayload = { nombre: 'Org', tipo: 'ONG', estado: 'activo' } as Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>;
    prismaStub.findMany.mockResolvedValueOnce([]);
    prismaStub.create.mockResolvedValueOnce({ id: 1 } as OrganizacionProps);

    await repository.findMany();
    await repository.create(createPayload);

    expect(prismaStub.findMany).toHaveBeenCalledTimes(1);
    expect(prismaStub.create).toHaveBeenCalledWith(createPayload);
    expect(prismaStub.update).not.toHaveBeenCalled();
    expect(prismaStub.delete).not.toHaveBeenCalled();
  });
});

describe('FeatureFlaggedPersonaRepository', () => {
  let prismaStub: ReturnType<typeof createRepoStub<PersonaProps>>;

  beforeEach(() => {
    prismaStub = createRepoStub<PersonaProps>();
  });

  it('usa Prisma para lecturas y escrituras', async () => {
    const repository = new FeatureFlaggedPersonaRepository(prismaStub as unknown as PersonaRepository);

    prismaStub.findMany.mockResolvedValueOnce([]);
    prismaStub.create.mockResolvedValueOnce({ id: 10 } as PersonaProps);

    await repository.findMany();
    await repository.create({ nombres: 'Ana', apellidos: 'Test', esRepresentante: true } as PersonaCreateInput);
    await repository.update(10, { email: 'a@test.com' } as PersonaUpdateInput);

    expect(prismaStub.findMany).toHaveBeenCalledTimes(1);
    expect(prismaStub.create).toHaveBeenCalledTimes(1);
    expect(prismaStub.update).toHaveBeenCalledWith(10, { email: 'a@test.com' });
  });
});
