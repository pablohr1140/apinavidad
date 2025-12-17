"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const env_1 = require("../../../config/env");
const logger_1 = require("../../../shared/logger");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException ? exception.message : 'Internal server error';
        const errorResponse = exception instanceof common_1.HttpException ? exception.getResponse() : null;
        const payload = {
            statusCode: status,
            message: typeof errorResponse === 'object' && errorResponse?.message ? errorResponse.message : message,
            requestId: request.requestId
        };
        // Log error without leaking stack in production.
        logger_1.logger.error({
            msg: 'request.exception',
            statusCode: status,
            requestId: request.requestId,
            error: {
                message: exception?.message,
                stack: env_1.env.NODE_ENV === 'development' ? exception?.stack : undefined
            }
        });
        response.status(status).json(env_1.env.NODE_ENV === 'development' ? payload : { statusCode: status, message, requestId: request.requestId });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
