/**
 * # seed
 * Propósito: Infra DB seed
 * Pertenece a: Infraestructura / Base de datos
 * Interacciones: Prisma, conexión a BD
 */

import 'reflect-metadata';
import { Logger } from '@nestjs/common';

import { env } from '@/config/env';
import { ALL_PERMISSION_CODES, ROLE_DEFINITIONS, RoleKey } from '@/domain/access-control';
import { EstadoOrganizacion } from '@/domain/entities';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { BcryptProvider } from '@/infra/security/BcryptProvider';

type RoleMap = Record<RoleKey, { id: number; role_key: string }>;
type PersonaMap = Record<string, { id: number }>;
type OrganizacionMap = Record<string, { id: bigint }>;
type PeriodoMap = Record<string, { id: number }>;
type NinoMap = Record<string, { id: bigint }>;
type DiscapacidadMap = Record<string, { id: number }>;
type EtniaMap = Record<string, { id: number }>;
type SectorMap = Record<string, { id: number }>;

const logger = new Logger('Seed');

async function seedPermissions(prisma: PrismaService) {
  const map: Record<string, { id: number }> = {};

  for (const code of ALL_PERMISSION_CODES) {
    const [resource, action] = code.split('.') as [string, string];
    const permission = await prisma.permissions.upsert({
      where: { resource_action: { resource, action } },
      update: { resource, action },
      create: { resource, action }
    });

    map[code] = permission;
  }

  return map;
}

async function seedRoles(prisma: PrismaService, permissions: Record<string, { id: number }>): Promise<RoleMap> {
  const roleMap = {} as RoleMap;

  for (const definition of ROLE_DEFINITIONS) {
    const role = await prisma.roles.upsert({
      where: { role_key: definition.key },
      update: { name: definition.name, description: definition.description ?? null, rank: definition.rank },
      create: { role_key: definition.key, name: definition.name, description: definition.description ?? null, rank: definition.rank }
    });

    await prisma.role_permissions.deleteMany({ where: { role_id: role.id } });
    const permissionIds = definition.permissions.map((code) => permissions[code]?.id).filter((id): id is number => Boolean(id));
    if (permissionIds.length > 0) {
      await prisma.role_permissions.createMany({
        data: permissionIds.map((permission_id) => ({ role_id: role.id, permission_id }))
      });
    }

    roleMap[definition.key as RoleKey] = role;
  }

  return roleMap;
}

async function seedAdminPersona(prisma: PrismaService, hashProvider: BcryptProvider, superadminRole: { id: number; role_key: string }) {
  const passwordHash = await hashProvider.hash(env.DEFAULT_ADMIN_PASSWORD);
  const now = new Date();
  const adminPersona = {
    nombres: 'Administrador',
    apellidos: 'Principal',
    run: '99999999',
    dv: '9',
    fecha_nacimiento: new Date('1990-01-01'),
    sexo: 'M',
    telefono: null,
    email: env.DEFAULT_ADMIN_EMAIL,
    direccion: null
  } as const;

  const existing = await prisma.personas.findFirst({ where: { run: adminPersona.run } });
  const data = {
    ...adminPersona,
    role_id: superadminRole.id,
    es_representante: true,
    password: passwordHash,
    updated_at: now
  };

  if (existing) {
    await prisma.personas.update({ where: { id: existing.id }, data });
  } else {
    await prisma.personas.create({ data: { ...data, created_at: now } });
  }
}

async function seedDiscapacidades(prisma: PrismaService): Promise<DiscapacidadMap> {
  const items = [{ nombre: 'Auditiva' }, { nombre: 'Visual' }, { nombre: 'Motora' }, { nombre: 'Cognitiva' }];

  const records = await Promise.all(
    items.map((item) =>
      prisma.discapacidades.upsert({
        where: { nombre: item.nombre },
        update: { activo: true },
        create: { nombre: item.nombre, activo: true }
      })
    )
  );

  return Object.fromEntries(records.map((record) => [record.nombre, { id: record.id }]));
}

async function seedEtnias(prisma: PrismaService): Promise<EtniaMap> {
  const items = [
    { nombre: 'Mapuche', codigo: 'MAP', descripcion: 'Pueblo Mapuche' },
    { nombre: 'Aymara', codigo: 'AYM', descripcion: 'Pueblo Aymara' }
  ];

  const records = await Promise.all(
    items.map((item) =>
      prisma.etnias.upsert({
        where: { nombre: item.nombre },
        update: { codigo: item.codigo, descripcion: item.descripcion, activo: true },
        create: { nombre: item.nombre, codigo: item.codigo, descripcion: item.descripcion, activo: true }
      })
    )
  );

  return Object.fromEntries(records.map((record) => [record.nombre, { id: record.id }]));
}

async function seedSectores(prisma: PrismaService): Promise<SectorMap> {
  const items = [
    { nombre: 'Norte' },
    { nombre: 'Centro' },
    { nombre: 'Sur' }
  ];

  const records = [] as { nombre: string; id: number }[];

  for (const item of items) {
    const existing = await prisma.sectores.findFirst({ where: { nombre: item.nombre } });
    if (existing) {
      const updated = await prisma.sectores.update({ where: { id: existing.id }, data: { estado: true } });
      records.push({ nombre: updated.nombre, id: updated.id });
      continue;
    }

    const created = await prisma.sectores.create({ data: { nombre: item.nombre, estado: true } });
    records.push({ nombre: created.nombre, id: created.id });
  }

  return Object.fromEntries(records.map((record) => [record.nombre, { id: record.id }]));
}

async function seedPersonas(prisma: PrismaService, roles: RoleMap): Promise<PersonaMap> {
  const personas = [
    {
      nombres: 'Carolina',
      apellidos: 'Munoz',
      run: '11111111',
      dv: '1',
      fecha_nacimiento: new Date('1985-04-02'),
      sexo: 'F',
      telefono: '+56 9 1111 1111',
      email: 'carolina.munoz@example.com',
      direccion: 'Av. Siempre Viva 123',
      roleKey: 'ADMIN' as RoleKey,
      esRepresentante: true
    },
    {
      nombres: 'Jorge',
      apellidos: 'Farre',
      run: '22222222',
      dv: '2',
      fecha_nacimiento: new Date('1979-11-10'),
      sexo: 'M',
      telefono: '+56 9 2222 2222',
      email: 'jorge.farre@example.com',
      direccion: 'Calle Los Lirios 456',
      roleKey: 'DIDECO' as RoleKey,
      esRepresentante: true
    },
    {
      nombres: 'Lucia',
      apellidos: 'Campos',
      run: '33333333',
      dv: '3',
      fecha_nacimiento: new Date('1992-07-23'),
      sexo: 'F',
      telefono: '+56 9 3333 3333',
      email: 'lucia.campos@example.com',
      direccion: 'Pasaje Azul 89',
      roleKey: 'REPRESENTANTE' as RoleKey,
      esRepresentante: true
    }
  ];

  const personaMap: PersonaMap = {};
  for (const persona of personas) {
    const existing = await prisma.personas.findFirst({ where: { run: persona.run ?? null } });
    const now = new Date();
    const roleId = persona.roleKey ? roles[persona.roleKey]?.id ?? null : null;

    const data = {
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      run: persona.run,
      dv: persona.dv,
      fecha_nacimiento: persona.fecha_nacimiento,
      sexo: persona.sexo,
      telefono: persona.telefono,
      email: persona.email,
      direccion: persona.direccion,
      providencia_id: null,
      es_representante: Boolean(persona.esRepresentante),
      role_id: roleId,
      updated_at: now
    };

    if (existing) {
      const updated = await prisma.personas.update({ where: { id: existing.id }, data });
      personaMap[persona.run] = { id: updated.id };
    } else {
      const created = await prisma.personas.create({ data: { ...data, created_at: now } });
      personaMap[persona.run] = { id: created.id };
    }
  }

  return personaMap;
}

async function seedOrganizaciones(prisma: PrismaService, sectores: SectorMap): Promise<OrganizacionMap> {
  const organizaciones = [
    {
      nombre: 'Centro Esperanza',
      tipo: 'ONG',
      telefono: '+56 2 2345 0000',
      correo: 'contacto@esperanza.cl',
      direccion: 'Av. Matucana 120',
      estado: 'activo',
      sector: 'Centro'
    },
    {
      nombre: 'Colegio Raices',
      tipo: 'Colegio',
      telefono: '+56 2 2789 4567',
      correo: 'admision@raices.cl',
      direccion: 'Camino del Bosque 456',
      estado: 'activo',
      sector: 'Sur'
    }
  ];

  const records: OrganizacionMap = {};

  for (const org of organizaciones) {
    const now = new Date();
    const data = {
      nombre: org.nombre,
      tipo: org.tipo,
      telefono: org.telefono,
      email: org.correo,
      direccion: org.direccion,
      estado: org.estado as EstadoOrganizacion,
      providencia_id: null,
      sector_id: sectores[org.sector]?.id ?? null,
      updated_at: now
    };

    const existing = await prisma.organizaciones.findUnique({ where: { nombre: org.nombre } });
    if (existing) {
      const updated = await prisma.organizaciones.update({ where: { id: existing.id }, data });
      records[org.nombre] = { id: updated.id };
    } else {
      const created = await prisma.organizaciones.create({ data: { ...data, created_at: now } });
      records[org.nombre] = { id: created.id };
    }
  }

  return records;
}

async function seedOrganizacionPersonas(prisma: PrismaService, organizaciones: OrganizacionMap, personas: PersonaMap) {
  const relaciones = [
    { organizacion: 'Centro Esperanza', personaRun: '11111111', rol: 'Directora' },
    { organizacion: 'Centro Esperanza', personaRun: '33333333', rol: 'Psicologa' },
    { organizacion: 'Colegio Raices', personaRun: '22222222', rol: 'Rector' }
  ];

  await Promise.all(
    relaciones.map(async (relacion) => {
      const organizacionId = organizaciones[relacion.organizacion]?.id;
      const personaId = personas[relacion.personaRun]?.id;
      if (!organizacionId || !personaId) {
        return;
      }

      const esPrincipal = /directora|rector/i.test(relacion.rol);
      const observaciones = relacion.rol;

      await prisma.organizacion_persona.upsert({
        where: { organizacion_id_persona_id: { organizacion_id: organizacionId, persona_id: personaId } },
        update: { es_principal: esPrincipal, es_reserva: false, activo: true, observaciones },
        create: {
          organizacion_id: organizacionId,
          persona_id: personaId,
          es_principal: esPrincipal,
          es_reserva: false,
          activo: true,
          observaciones
        }
      });
    })
  );
}

async function seedPeriodos(prisma: PrismaService): Promise<PeriodoMap> {
  const periodos = [
    {
      nombre: '2023',
      fecha_inicio: new Date('2023-03-01'),
      fecha_fin: new Date('2023-12-15'),
      estado_periodo: 'cerrado',
      es_activo: false
    },
    {
      nombre: '2024',
      fecha_inicio: new Date('2024-03-01'),
      fecha_fin: new Date('2024-12-15'),
      estado_periodo: 'abierto',
      es_activo: true
    }
  ];

  const records: PeriodoMap = {};

  for (const periodo of periodos) {
    const now = new Date();
    const data = { ...periodo, updated_at: now };
    const existing = await prisma.periodos.findUnique({ where: { nombre: periodo.nombre } });
    if (existing) {
      const updated = await prisma.periodos.update({ where: { id: existing.id }, data });
      records[periodo.nombre] = { id: updated.id };
    } else {
      const created = await prisma.periodos.create({ data: { ...data, created_at: now } });
      records[periodo.nombre] = { id: created.id };
    }
  }

  return records;
}

async function seedOrganizacionPeriodos(prisma: PrismaService, organizaciones: OrganizacionMap, periodos: PeriodoMap) {
  const cupos = [
    { organizacion: 'Centro Esperanza', periodo: '2023', cupos: 60 },
    { organizacion: 'Centro Esperanza', periodo: '2024', cupos: 85 },
    { organizacion: 'Colegio Raices', periodo: '2023', cupos: 90 }
  ];

  await Promise.all(
    cupos.map(async (config) => {
      const organizacionId = organizaciones[config.organizacion]?.id;
      const periodoId = periodos[config.periodo]?.id;
      if (!organizacionId || !periodoId) {
        return;
      }

      const observaciones = `Cupos: ${config.cupos}`;

      await prisma.organizacion_periodo.upsert({
        where: { organizacion_id_periodo_id: { organizacion_id: organizacionId, periodo_id: periodoId } },
        update: { observaciones },
        create: { organizacion_id: organizacionId, periodo_id: periodoId, estado: 'pendiente', observaciones }
      });
    })
  );
}

async function seedNinos(prisma: PrismaService, organizaciones: OrganizacionMap, periodos: PeriodoMap, etnias: EtniaMap): Promise<NinoMap> {
  const ninos = [
    {
      nombres: 'Mateo',
      apellidos: 'Rivas',
      run: '10101010',
      dv: 'K',
      documento: null,
      fecha_nacimiento: new Date('2015-05-15'),
      sexo: 'M',
      organizacion: 'Centro Esperanza',
      periodo: '2024',
      edad: 9,
      tiene_discapacidad: true,
      tiene_RSH: false,
      fecha_ingreso: new Date('2022-03-10'),
      fecha_retiro: null,
      etniaNombre: 'Mapuche',
      estado: 'registrado'
    },
    {
      nombres: 'Fernanda',
      apellidos: 'Lopez',
      run: '20202020',
      dv: '7',
      documento: null,
      fecha_nacimiento: new Date('2014-08-22'),
      sexo: 'F',
      organizacion: 'Colegio Raices',
      periodo: '2024',
      edad: 10,
      tiene_discapacidad: false,
      tiene_RSH: false,
      fecha_ingreso: new Date('2021-03-05'),
      fecha_retiro: null,
      etniaNombre: 'Aymara',
      estado: 'registrado'
    },
    {
      nombres: 'Ignacio',
      apellidos: 'Pino',
      run: '30303030',
      dv: '5',
      documento: null,
      fecha_nacimiento: new Date('2013-01-03'),
      sexo: 'M',
      organizacion: 'Colegio Raices',
      periodo: '2023',
      edad: 10,
      tiene_discapacidad: true,
      tiene_RSH: false,
      fecha_ingreso: new Date('2020-03-02'),
      fecha_retiro: new Date('2023-12-20'),
      etniaNombre: null,
      estado: 'inhabilitado'
    }
  ];

  const records: NinoMap = {};

  const tipoDocCdi = await prisma.tipo_documentos.findFirst({ where: { codigo: 'CDI' } });
  const tipoDocId = tipoDocCdi?.id ?? null;

  for (const nino of ninos) {
    const { organizacion, periodo, ...data } = nino;
    const organizacionId = organizaciones[organizacion]?.id;
    const periodoId = periodos[periodo]?.id;
    if (!organizacionId || !periodoId) {
      continue;
    }

    const etniaId = data.etniaNombre ? etnias[data.etniaNombre]?.id ?? null : null;

    const documento_numero = data.documento
      ? data.documento
      : data.run && data.dv
        ? `${data.run}-${data.dv}`
        : data.run ?? '';

    const estado = data.estado === 'inhabilitado' ? false : true;

    const payload = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      documento_numero,
      tipo_documento_id: tipoDocId,
      nacionalidad_id: null,
      etnia_id: etniaId,
      persona_registro_id: null,
      fecha_nacimiento: data.fecha_nacimiento,
      sexo: data.sexo,
      organizacion_id: organizacionId,
      periodo_id: periodoId,
      es_prioritario: false,
      edad: data.edad ?? null,
      tiene_discapacidad: Boolean(data.tiene_discapacidad),
      tiene_RSH: Boolean(data.tiene_RSH),
      fecha_ingreso: data.fecha_ingreso,
      fecha_retiro: data.fecha_retiro,
      estado,
      updated_at: new Date()
    };

    const existing = await prisma.ninos.findFirst({ where: { documento_numero } });
    if (existing) {
      const updated = await prisma.ninos.update({ where: { id: existing.id }, data: payload });
      records[nino.run] = { id: updated.id };
    } else {
      const created = await prisma.ninos.create({ data: { ...payload, created_at: new Date() } });
      records[nino.run] = { id: created.id };
    }
  }

  return records;
}

async function seedDiscapacidadNinos(prisma: PrismaService, ninos: NinoMap, discapacidades: DiscapacidadMap) {
  const relaciones = [
    { run: '10101010', discapacidad: 'Cognitiva', porcentaje: 70 },
    { run: '30303030', discapacidad: 'Visual', porcentaje: 40 }
  ];

  await Promise.all(
    relaciones.map(async (relacion) => {
      const ninoId = ninos[relacion.run]?.id;
      const discapacidadId = discapacidades[relacion.discapacidad]?.id;
      if (!ninoId || !discapacidadId) {
        return;
      }

      await prisma.discapacidad_nino.upsert({
        where: { nino_id_discapacidad_id: { nino_id: ninoId, discapacidad_id: discapacidadId } },
        update: { porcentaje: relacion.porcentaje },
        create: { nino_id: ninoId, discapacidad_id: discapacidadId, porcentaje: relacion.porcentaje }
      });
    })
  );
}

export async function runSeed() {
  const prisma = new PrismaService();
  const hashProvider = new BcryptProvider();

  await prisma.$connect();

  try {
    const permissionMap = await seedPermissions(prisma);
    const roles = await seedRoles(prisma, permissionMap);
    const superadminRole = roles.SUPERADMIN;
    if (!superadminRole) {
      throw new Error('Rol SUPERADMIN no inicializado');
    }

    await seedAdminPersona(prisma, hashProvider, superadminRole);
    const discapacidades = await seedDiscapacidades(prisma);
    const etnias = await seedEtnias(prisma);
    const sectores = await seedSectores(prisma);
    const personas = await seedPersonas(prisma, roles);
    const organizaciones = await seedOrganizaciones(prisma, sectores);
    await seedOrganizacionPersonas(prisma, organizaciones, personas);
    const periodos = await seedPeriodos(prisma);
    await seedOrganizacionPeriodos(prisma, organizaciones, periodos);
    const ninos = await seedNinos(prisma, organizaciones, periodos, etnias);
    await seedDiscapacidadNinos(prisma, ninos, discapacidades);

    logger.log('Seed completed');
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runSeed().catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}
