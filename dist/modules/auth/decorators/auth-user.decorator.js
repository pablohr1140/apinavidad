"use strict";
/**
 * # auth user.decorator
 * Propósito: Decorador auth user.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUser = void 0;
const common_1 = require("@nestjs/common");
exports.AuthUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
