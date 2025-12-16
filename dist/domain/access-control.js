"use strict";
/**
 * # access control
 * Propósito: Dominio access control
 * Pertenece a: Dominio
 * Interacciones: Entidades, reglas de negocio
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleDefinition = exports.ROLE_DEFINITIONS = exports.ALL_PERMISSION_CODES = exports.PERMISSION_ACTIONS = exports.PERMISSION_RESOURCES = exports.ROLE_KEYS = void 0;
exports.ROLE_KEYS = ['SUPERADMIN', 'ADMIN', 'DIDECO', 'REPRESENTANTE', 'PROVIDENCIA'];
exports.PERMISSION_RESOURCES = ['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos', 'perfil'];
exports.PERMISSION_ACTIONS = ['view', 'create', 'update', 'delete'];
const buildPermissionCodes = (resource) => exports.PERMISSION_ACTIONS.map((action) => `${resource}.${action}`);
exports.ALL_PERMISSION_CODES = exports.PERMISSION_RESOURCES.flatMap(buildPermissionCodes);
const grantForResources = (resources) => resources.flatMap(buildPermissionCodes);
exports.ROLE_DEFINITIONS = [
    {
        key: 'SUPERADMIN',
        name: 'Superadministrador',
        rank: 500,
        permissions: exports.ALL_PERMISSION_CODES
    },
    {
        key: 'ADMIN',
        name: 'Administrador',
        rank: 400,
        permissions: grantForResources(['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos', 'perfil'])
    },
    {
        key: 'DIDECO',
        name: 'DIDECO',
        rank: 300,
        permissions: grantForResources(['ninos', 'organizaciones', 'personas', 'discapacidad', 'periodos'])
    },
    {
        key: 'REPRESENTANTE',
        name: 'Representante',
        rank: 200,
        permissions: grantForResources(['ninos'])
    },
    {
        key: 'PROVIDENCIA',
        name: 'Providencia',
        rank: 100,
        permissions: []
    }
];
const getRoleDefinition = (key) => exports.ROLE_DEFINITIONS.find((role) => role.key === key);
exports.getRoleDefinition = getRoleDefinition;
