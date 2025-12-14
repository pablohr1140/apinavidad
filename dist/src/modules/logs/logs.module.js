"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModule = void 0;
const common_1 = require("@nestjs/common");
const LogActivityUseCase_1 = require("../../application/use-cases/logs/LogActivityUseCase");
const LogRepository_1 = require("../../application/repositories/LogRepository");
const PrismaLogRepository_1 = require("../../infra/database/repositories/PrismaLogRepository");
let LogsModule = class LogsModule {
};
exports.LogsModule = LogsModule;
exports.LogsModule = LogsModule = __decorate([
    (0, common_1.Module)({
        providers: [LogActivityUseCase_1.LogActivityUseCase, PrismaLogRepository_1.PrismaLogRepository, { provide: LogRepository_1.LogRepository, useExisting: PrismaLogRepository_1.PrismaLogRepository }],
        exports: [LogActivityUseCase_1.LogActivityUseCase]
    })
], LogsModule);
