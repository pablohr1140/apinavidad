"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const logger_1 = require("../../../shared/logger");
let RequestLoggingInterceptor = class RequestLoggingInterceptor {
    intercept(context, next) {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        const { method, url } = req;
        const startedAt = Date.now();
        const log = req.log ?? logger_1.logger;
        log.info({ msg: 'request.start', method, url, requestId: req.requestId });
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                const duration = Date.now() - startedAt;
                log.info({
                    msg: 'request.complete',
                    method,
                    url,
                    statusCode: res.statusCode,
                    durationMs: duration,
                    requestId: req.requestId
                });
            },
            error: (error) => {
                const duration = Date.now() - startedAt;
                log.error({
                    msg: 'request.error',
                    method,
                    url,
                    statusCode: res.statusCode,
                    durationMs: duration,
                    requestId: req.requestId,
                    error: { message: error?.message }
                });
            }
        }));
    }
};
exports.RequestLoggingInterceptor = RequestLoggingInterceptor;
exports.RequestLoggingInterceptor = RequestLoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], RequestLoggingInterceptor);
