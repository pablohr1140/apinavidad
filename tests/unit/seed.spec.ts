/**
 * # seed.spec
 * Propósito: Prueba unitaria seed.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

const hashMock = vi.fn().mockResolvedValue('hashed-pass');
const bcryptCtor = vi.fn();

class BcryptProviderMock {
  hash = hashMock;

  constructor() {
    bcryptCtor();
  }
}

vi.mock('@/infra/security/BcryptProvider', () => ({ BcryptProvider: BcryptProviderMock }));

vi.mock('@/config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3000,
    LOG_LEVEL: 'debug',
    PASETO_SECRET: 't'.repeat(64),
    DB_HOST: 'localhost',
    DB_PORT: 1433,
    DB_USER: 'sa',
    DB_PASSWORD: 'pass',
    DB_NAME: 'test',
    DEFAULT_ADMIN_EMAIL: 'admin@example.com',
    DEFAULT_ADMIN_PASSWORD: 'ChangeMe123!'
  }
}));

const createStore = () => ({
  permissions: [] as Array<{ id: number; resource: string; action: string }>,
  roles: [] as Array<{ id: number; role_key: string; name: string; description: string | null; rank: number }>,
  role_permissions: [] as Array<{ role_id: number; permission_id: number }>,
  personas: [] as Array<{ id: number; run: string | null; email: string | null; role_id: number | null }>,
  discapacidades: [] as Array<{ id: number; nombre: string; descripcion: string | null }>,
  etnias: [] as Array<{ id: number; nombre: string; codigo: string | null; descripcion: string | null }>,
  sectores: [] as Array<{ id: number; nombre: string; estado: string }>,
  tipo_documentos: [] as Array<{ id: number; codigo: string; nombre: string }>,
  organizaciones: [] as Array<{ id: bigint; nombre: string }>,
  organizacion_persona: [] as Array<{ organizacion_id: bigint; persona_id: number }>,
  periodos: [] as Array<{ id: number; nombre: string }>,
  organizacion_periodo: [] as Array<{ organizacion_id: bigint; periodo_id: number }>,
  ninos: [] as Array<{ id: bigint; run: string | null; organizacion_id: bigint; periodo_id: number }>,
  discapacidad_nino: [] as Array<{ nino_id: bigint; discapacidad_id: number }>
});

const buildPrismaMock = () => {
  const store = createStore();
  let idCounters = {
    permission: 1,
    role: 1,
    persona: 1,
    discapacidad: 1,
    etnia: 1,
    sector: 1,
    tipo_documento: 1,
    organizacion: 1n,
    periodo: 1,
    nino: 1n
  } as const;

  const findBy = <T extends { [k: string]: unknown }>(arr: T[], predicate: (item: T) => boolean) => arr.find(predicate) ?? null;

  const upsert = <T extends { [k: string]: unknown }>(params: { where: Record<string, unknown>; update: Partial<T>; create: T }, keyMatcher: (item: T) => boolean, idField: keyof T, genId: () => T[keyof T]) => {
    const existing = findBy(store as unknown as T[], keyMatcher);
    if (existing) {
      Object.assign(existing, params.update);
      return existing;
    }
    const created = { ...params.create, [idField]: genId() } as T;
    (store as unknown as T[]).push(created);
    return created;
  };

  const prisma = {
    permissions: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const match = (p: { resource: string; action: string }) => p.resource === where.resource_action.resource && p.action === where.resource_action.action;
        const existing = findBy(store.permissions, match);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create, id: idCounters.permission++ };
        store.permissions.push(record);
        return record;
      })
    },
    roles: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const match = (r: { role_key: string }) => r.role_key === where.role_key;
        const existing = findBy(store.roles, match);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create, id: idCounters.role++ };
        store.roles.push(record);
        return record;
      }),
      findUnique: vi.fn(async ({ where }) => findBy(store.roles, (r) => r.role_key === where.role_key))
    },
    role_permissions: {
      deleteMany: vi.fn(async ({ where }) => {
        const before = store.role_permissions.length;
        store.role_permissions = store.role_permissions.filter((rp) => rp.role_id !== where.role_id);
        return { count: before - store.role_permissions.length };
      }),
      createMany: vi.fn(async ({ data }) => {
        (data as Array<{ role_id: number; permission_id: number }>).forEach((entry) => store.role_permissions.push(entry));
        return { count: (data as Array<unknown>).length };
      })
    },
    personas: {
      findFirst: vi.fn(async ({ where }) => findBy(store.personas, (p) => (where.run ? p.run === where.run : p.email === where.email))),
      update: vi.fn(async ({ where, data }) => {
        const persona = findBy(store.personas, (p) => p.id === where.id);
        if (!persona) return null;
        Object.assign(persona, data);
        return persona;
      }),
      create: vi.fn(async ({ data }) => {
        const record = { ...data, id: idCounters.persona++ } as unknown as (typeof store.personas)[number];
        store.personas.push(record);
        return record;
      })
    },
    discapacidades: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const existing = findBy(store.discapacidades, (d) => d.nombre === where.nombre);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create, id: idCounters.discapacidad++ };
        store.discapacidades.push(record);
        return record;
      })
    },
    etnias: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const existing = findBy(store.etnias, (e) => e.nombre === where.nombre);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create, id: idCounters.etnia++ };
        store.etnias.push(record);
        return record;
      })
    },
    sectores: {
      findFirst: vi.fn(async ({ where }) => findBy(store.sectores, (s) => s.nombre === where.nombre)),
      update: vi.fn(async ({ where, data }) => {
        const sector = findBy(store.sectores, (s) => s.id === where.id);
        if (!sector) return null;
        Object.assign(sector, data);
        return sector;
      }),
      create: vi.fn(async ({ data }) => {
        const record = { ...data, id: idCounters.sector++ } as (typeof store.sectores)[number];
        store.sectores.push(record);
        return record;
      })
    },
    tipo_documentos: {
      findFirst: vi.fn(async ({ where }) => {
        const existing = findBy(store.tipo_documentos, (d) => d.codigo === where.codigo);
        if (existing) return existing;

        const created = { id: idCounters.tipo_documento++, codigo: where.codigo, nombre: where.codigo } as (typeof store.tipo_documentos)[number];
        store.tipo_documentos.push(created);
        return created;
      })
    },
    organizaciones: {
      findUnique: vi.fn(async ({ where }) => findBy(store.organizaciones, (o) => o.nombre === where.nombre)),
      create: vi.fn(async ({ data }) => {
        const record = { ...data, id: idCounters.organizacion++ } as unknown as (typeof store.organizaciones)[number];
        store.organizaciones.push(record);
        return record;
      }),
      update: vi.fn(async ({ where, data }) => {
        const org = findBy(store.organizaciones, (o) => o.id === where.id);
        if (!org) return null;
        Object.assign(org, data);
        return org;
      })
    },
    organizacion_persona: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const existing = findBy(store.organizacion_persona, (op) => op.organizacion_id === where.organizacion_id_persona_id.organizacion_id && op.persona_id === where.organizacion_id_persona_id.persona_id);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create } as (typeof store.organizacion_persona)[number];
        store.organizacion_persona.push(record);
        return record;
      })
    },
    periodos: {
      findUnique: vi.fn(async ({ where }) => findBy(store.periodos, (p) => p.nombre === where.nombre)),
      create: vi.fn(async ({ data }) => {
        const record = { ...data, id: idCounters.periodo++ } as unknown as (typeof store.periodos)[number];
        store.periodos.push(record);
        return record;
      }),
      update: vi.fn(async ({ where, data }) => {
        const periodo = findBy(store.periodos, (p) => p.id === where.id);
        if (!periodo) return null;
        Object.assign(periodo, data);
        return periodo;
      })
    },
    organizacion_periodo: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const existing = findBy(store.organizacion_periodo, (op) => op.organizacion_id === where.organizacion_id_periodo_id.organizacion_id && op.periodo_id === where.organizacion_id_periodo_id.periodo_id);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create } as (typeof store.organizacion_periodo)[number];
        store.organizacion_periodo.push(record);
        return record;
      })
    },
    ninos: {
      findFirst: vi.fn(async ({ where }) => findBy(store.ninos, (n) => n.run === where.run)),
      create: vi.fn(async ({ data }) => {
        const record = { ...data, id: idCounters.nino++ } as unknown as (typeof store.ninos)[number];
        store.ninos.push(record);
        return record;
      }),
      update: vi.fn(async ({ where, data }) => {
        const nino = findBy(store.ninos, (n) => n.id === where.id);
        if (!nino) return null;
        Object.assign(nino, data);
        return nino;
      })
    },
    discapacidad_nino: {
      upsert: vi.fn(async ({ where, update, create }) => {
        const existing = findBy(store.discapacidad_nino, (dn) => dn.nino_id === where.nino_id_discapacidad_id.nino_id && dn.discapacidad_id === where.nino_id_discapacidad_id.discapacidad_id);
        if (existing) {
          Object.assign(existing, update);
          return existing;
        }
        const record = { ...create } as (typeof store.discapacidad_nino)[number];
        store.discapacidad_nino.push(record);
        return record;
      })
    },
    $connect: vi.fn(),
    $disconnect: vi.fn()
  };

  return { prisma, store };
};

describe('seed.ts', () => {
  let prismaMock: ReturnType<typeof buildPrismaMock>;

  beforeEach(() => {
    vi.resetModules();
    prismaMock = buildPrismaMock();
    vi.doMock('@/infra/database/prisma/prisma.service', () => ({
      PrismaService: class {
        constructor() {
          return prismaMock.prisma;
        }
      }
    }));
    bcryptCtor.mockClear();
    hashMock.mockClear();
  });

  it('crea datos base y destruye la conexión', async () => {
    const { runSeed } = await import('@/infra/database/seed');

    await runSeed();

    expect(bcryptCtor).toHaveBeenCalledTimes(1);
    expect(hashMock).toHaveBeenCalledWith('ChangeMe123!');
    expect(prismaMock.prisma.permissions.upsert).toHaveBeenCalled();
    expect(prismaMock.prisma.roles.upsert).toHaveBeenCalled();
    expect(prismaMock.prisma.personas.create).toHaveBeenCalled();
    expect(prismaMock.prisma.discapacidades.upsert).toHaveBeenCalled();
    expect(prismaMock.prisma.ninos.create).toHaveBeenCalled();
    expect(prismaMock.prisma.$disconnect).toHaveBeenCalledTimes(1);
  }, 20000);
});
