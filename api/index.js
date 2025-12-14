'use strict';

require('../dist/config/module-alias');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let cachedServer;

async function bootstrapServer() {
  if (cachedServer) {
    return cachedServer;
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

module.exports = async function handler(req, res) {
  const server = await bootstrapServer();
  return server(req, res);
};
