/**
 * # module alias
 * Propósito: Config module alias
 * Pertenece a: Configuración
 * Interacciones: Variables de entorno, bootstrap
 */

/**
 * # config/module-alias.ts
 *
 * Propósito: configurar el alias `@` para apuntar a `src` o `dist` según exista la carpeta compilada.
 * Responsabilidades: resolver la ruta base del proyecto y registrar el alias con `module-alias`.
 * Interacciones: usado por imports con `@/...` en tiempo de build y runtime.
 * Pertenece a: capa de configuración/boot.
 */
import { existsSync } from 'fs';
import { join } from 'path';

import { addAlias } from 'module-alias';

const projectRoot = process.cwd();
const distPath = join(projectRoot, 'dist');
const srcPath = join(projectRoot, 'src');
const aliasTarget = existsSync(distPath) ? distPath : srcPath;

addAlias('@', aliasTarget);
