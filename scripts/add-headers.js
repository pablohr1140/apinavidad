/**
 * # add headers
 * Propósito: Script add headers
 * Pertenece a: Script utilitario
 * Interacciones: CLI/automatización
 */

const fs = require('fs');
const path = require('path');

const roots = ['docs', 'src', 'prisma', 'scripts', 'tests'];
const allowedExts = new Set(['.ts', '.js', '.tsx', '.md', '.sql', '.prisma', '.yaml', '.yml', '.ps1', '.sh']);
const skipDirs = new Set(['dist', 'node_modules', '.git']);

function humanize(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classify(relPath, ext, base) {
  const parts = relPath.split(path.sep);
  const lower = relPath.toLowerCase();
  const name = humanize(base);
  let layer = 'General';
  let purpose = `Archivo ${name}`;
  let interactions = 'N/A';

  if (lower.startsWith('docs')) {
    layer = 'Documentación';
    purpose = `Documento ${name}`;
    interactions = 'Texto de referencia';
  } else if (lower.startsWith(`src${path.sep}application${path.sep}use-cases`)) {
    layer = 'Aplicación / Caso de uso';
    purpose = `Caso de uso ${name}`;
    interactions = 'Repositorios, servicios de dominio';
  } else if (lower.startsWith(`src${path.sep}application${path.sep}repositories`)) {
    layer = 'Aplicación / Repositorio contrato';
    purpose = `Contrato de repositorio ${name}`;
    interactions = 'Capa de infraestructura que implementa el contrato';
  } else if (lower.startsWith(`src${path.sep}application${path.sep}dtos`)) {
    layer = 'Aplicación / DTOs';
    purpose = `DTOs para ${name}`;
    interactions = 'Validación y transporte de datos';
  } else if (lower.includes(`${path.sep}modules${path.sep}`)) {
    if (lower.includes('controller')) {
      layer = 'HTTP Controller (Nest)';
      purpose = `Endpoints HTTP de ${name}`;
      interactions = 'Casos de uso, pipes/decorators Nest';
    } else if (lower.includes('guard')) {
      layer = 'Auth/Route Guard (Nest)';
      purpose = `Guardia de acceso ${name}`;
      interactions = 'Nest ExecutionContext, servicios de auth';
    } else if (lower.includes('decorator')) {
      layer = 'Decorador (Nest)';
      purpose = `Decorador ${name}`;
      interactions = 'Metadatos de rutas/servicios';
    } else if (lower.includes('pipe')) {
      layer = 'Pipe (Nest)';
      purpose = `Pipe de validación/transformación ${name}`;
      interactions = 'DTOs, validación';
    } else if (lower.includes('service')) {
      layer = 'Servicio de módulo (Nest)';
      purpose = `Servicio ${name}`;
      interactions = 'Repositorios, servicios externos';
    } else if (lower.includes('module.ts')) {
      layer = 'Módulo Nest';
      purpose = `Módulo de agregación ${name}`;
      interactions = 'Providers, controllers';
    } else {
      layer = 'Módulo Nest';
      purpose = `Elemento de módulo ${name}`;
      interactions = 'NestJS providers/controllers';
    }
  } else if (lower.startsWith(`src${path.sep}infra${path.sep}database${path.sep}repositories`)) {
    layer = 'Infraestructura / Repositorio Prisma';
    purpose = `Repositorio Prisma ${name}`;
    interactions = 'PrismaService, entidades de dominio';
  } else if (lower.startsWith(`src${path.sep}infra${path.sep}database`)) {
    layer = 'Infraestructura / Base de datos';
    purpose = `Infra DB ${name}`;
    interactions = 'Prisma, conexión a BD';
  } else if (lower.startsWith(`src${path.sep}infra${path.sep}auth`)) {
    layer = 'Infraestructura / Auth';
    purpose = `Servicio/Auth ${name}`;
    interactions = 'Tokens, servicios de auth';
  } else if (lower.startsWith(`src${path.sep}infra`)) {
    layer = 'Infraestructura';
    purpose = `Infra ${name}`;
    interactions = 'Servicios externos / adaptadores';
  } else if (lower.startsWith(`src${path.sep}config`)) {
    layer = 'Configuración';
    purpose = `Config ${name}`;
    interactions = 'Variables de entorno, bootstrap';
  } else if (lower.startsWith(`src${path.sep}domain`)) {
    layer = 'Dominio';
    purpose = `Dominio ${name}`;
    interactions = 'Entidades, reglas de negocio';
  } else if (lower.startsWith(`src${path.sep}shared`)) {
    layer = 'Compartido';
    purpose = `Utilidades compartidas ${name}`;
    interactions = 'Helpers reutilizables';
  } else if (lower.startsWith('prisma')) {
    layer = 'Prisma';
    purpose = `Esquema/consulta ${name}`;
    interactions = 'Base de datos';
  } else if (lower.startsWith('scripts')) {
    layer = 'Script utilitario';
    purpose = `Script ${name}`;
    interactions = 'CLI/automatización';
  } else if (lower.startsWith('tests')) {
    const kind = lower.includes(`${path.sep}e2e${path.sep}`) ? 'Prueba e2e' : 'Prueba unitaria';
    layer = `Tests (${kind})`;
    purpose = `${kind} ${name}`;
    interactions = lower.includes('e2e') ? 'Nest app, Supertest/Prisma' : 'Mocks y servicios';
  }

  return { layer, purpose, interactions, title: humanize(base) };
}

function hasHeader(content, ext) {
  const trimmed = content.trimStart();
  if (ext === '.md') return trimmed.startsWith('<!-- # ');
  if (ext === '.sql' || ext === '.prisma') return trimmed.startsWith('/* # ') || trimmed.startsWith('// # ');
  if (ext === '.yaml' || ext === '.yml' || ext === '.ps1' || ext === '.sh') return trimmed.startsWith('# # ');
  return trimmed.startsWith('/** # ');
}

function buildHeader(ext, meta) {
  const lines = [
    `# ${meta.title}`,
    `Propósito: ${meta.purpose}`,
    `Pertenece a: ${meta.layer}`,
    `Interacciones: ${meta.interactions}`
  ];

  switch (ext) {
    case '.md':
      return `<!-- ${lines.join(' | ')} -->\n\n`;
    case '.sql':
      return `/* ${lines.join(' | ')} */\n\n`;
    case '.prisma':
      return lines.map((l) => `// ${l}`).join('\n') + '\n\n';
    case '.yaml':
    case '.yml':
    case '.ps1':
    case '.sh':
      return lines.map((l) => `# ${l}`).join('\n') + '\n\n';
    default:
      return ['/**', ...lines.map((l) => ` * ${l}`), ' */', ''].join('\n') + '\n';
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else {
      const ext = path.extname(entry.name);
      if (!allowedExts.has(ext)) continue;
      const rel = path.relative(process.cwd(), full);
      const base = path.basename(entry.name, ext);
      const content = fs.readFileSync(full, 'utf8');
      if (hasHeader(content, ext)) continue;
      const meta = classify(rel, ext, base);
      const header = buildHeader(ext, meta);
      let newContent = header + content;
      // Keep shebang on top for scripts
      if (content.startsWith('#!')) {
        const [firstLine, ...rest] = content.split('\n');
        newContent = `${firstLine}\n${header}${rest.join('\n')}`;
      }
      fs.writeFileSync(full, newContent, 'utf8');
      console.log(`Added header: ${rel}`);
    }
  }
}

roots.forEach((root) => {
  const full = path.join(process.cwd(), root);
  if (fs.existsSync(full)) {
    walk(full);
  }
});
