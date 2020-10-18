const grpc = require('grpc');
const health = require('grpc-health-check');
const config = require('./config/env');
const analyze = require('./wappalyzer-impl/analyze');
const proto = require('./proto');
const waManager = require('./wa-manager');
const Healthz = require('./healthz');
const logger = require('./logger');

waManager.start();

const server = new grpc.Server();
process.on('SIGTERM', () => {
  server.tryShutdown(() => {});
});
process.on('uncaughtException', (e) => {
  logger.error('uncaughtException', e);
});
process.on('unhandledRejection', (e) => {
  logger.error('unhandledRejection', e);
});

server.addService(health.service, new Healthz());
server.addService(proto.wappalyzerGrpc.Wappalyzer.service, {
  Analyze: analyze,
});

server.bind(`0.0.0.0:${config.grpc.port}`, grpc.ServerCredentials.createInsecure());
server.start();
