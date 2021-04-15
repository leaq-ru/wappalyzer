const grpc = require('grpc');
const health = require('grpc-health-check');
const config = require('./config/env');
const analyze = require('./wappalyzer-impl/analyze');
const proto = require('./proto');
const logger = require('./logger');

const server = new grpc.Server();

const sd = () => {
  server.tryShutdown(() => {});
};

setTimeout(() => sd, 3 * 60 * 60 * 1000);
process.on('SIGTERM', sd);
process.on('uncaughtException', (e) => {
  logger.error('uncaughtException', e);
});
process.on('unhandledRejection', (e) => {
  logger.error('unhandledRejection', e);
});

server.addService(health.service, new health.Implementation({
  '': 1,
}));
server.addService(proto.wappalyzerGrpc.Wappalyzer.service, {
  Analyze: analyze,
});

server.bind(`0.0.0.0:${config.grpc.port}`, grpc.ServerCredentials.createInsecure());
server.start();
