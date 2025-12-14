"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutoInhabilitarJob = runAutoInhabilitarJob;
const core_1 = require("@nestjs/core");
const AutoInhabilitarNinosUseCase_1 = require("../../application/use-cases/ninos/AutoInhabilitarNinosUseCase");
const logger_1 = require("../../shared/logger");
const app_module_1 = require("../../app.module");
async function runAutoInhabilitarJob() {
    const context = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const useCase = context.get(AutoInhabilitarNinosUseCase_1.AutoInhabilitarNinosUseCase);
        const result = await useCase.execute({});
        logger_1.logger.info({ afectados: result.afectados }, 'Auto inhabilitacion ejecutada');
    }
    finally {
        await context.close();
    }
}
if (process.env.NODE_ENV !== 'test') {
    runAutoInhabilitarJob().catch((error) => {
        logger_1.logger.error(error);
        process.exit(1);
    });
}
