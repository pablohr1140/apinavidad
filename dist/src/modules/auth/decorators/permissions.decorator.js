"use strict";
/**
 * # permissions.decorator
 * Propósito: Decorador permissions.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS_KEY = void 0;
exports.Permissions = Permissions;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'requiredPermissions';
function normalize(config) {
    return {
        permissions: config.permissions,
        mode: config.mode ?? 'any'
    };
}
function Permissions(...args) {
    if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
        return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, normalize(args[0]));
    }
    return (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, normalize({
        permissions: args,
        mode: 'any'
    }));
}
