const grpc = require('grpc');
const health = require('grpc-health-check');
const stan = require('node-nats-streaming');
const { v4: uuidv4 } = require('uuid');
const analyze = require('./analyze');
const config = require('./config/env');
const analyzeGrpc = require('./wappalyzer-impl/analyze');
const proto = require('./proto');
const logger = require('./logger');

const server = new grpc.Server();

const sc = stan.connect(config.stan.clusterId, `${config.serviceName}-${uuidv4()}`, {
  url: config.nats.url,
});

const sd = () => {
  server.tryShutdown(() => {
    process.exit(0);
  });
};

process.setMaxListeners(0);
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
  Analyze: analyzeGrpc,
});

server.bind(`0.0.0.0:${config.grpc.port}`, grpc.ServerCredentials.createInsecure());
server.start();

function subscribe() {
  const opts = sc.subscriptionOptions();
  opts.setMaxInFlight(1);
  opts.setDurableName(config.stan.subjectCompanyNew);

  const sub = sc.subscribe(config.stan.subjectCompanyNew, config.serviceName, opts);

  sub.on('message', async (m) => {
    const { companyId, url } = JSON.parse(m.getData());

    const result = await analyze(url);

    sc.publish(config.stan.subjectAnalyzeResult, JSON.stringify({
      companyId,
      result,
    }));
  });

  sub.on('closed', subscribe);
  sub.on('unsubscribed', subscribe);
}

sc.on('connect', () => {
  subscribe();
});
sc.on('close', sd);
