"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * # config/module-alias.ts
 *
 * Propósito: configurar el alias `@` para apuntar a `src` o `dist` según exista la carpeta compilada.
 * Responsabilidades: resolver la ruta base del proyecto y registrar el alias con `module-alias`.
 * Interacciones: usado por imports con `@/...` en tiempo de build y runtime.
 * Pertenece a: capa de configuración/boot.
 */
const module_alias_1 = __importDefault(require("module-alias"));
const path_1 = require("path");
const fs_1 = require("fs");
const projectRoot = process.cwd();
const distPath = (0, path_1.join)(projectRoot, 'dist');
const srcPath = (0, path_1.join)(projectRoot, 'src');
const aliasTarget = (0, fs_1.existsSync)(distPath) ? distPath : srcPath;
module_alias_1.default.addAlias('@', aliasTarget);
