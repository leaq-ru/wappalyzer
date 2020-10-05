const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const config = require('./config/env');
const analyze = require('./wappalyzer/analyze');

const packageDefinition = protoLoader.loadSync(
  './node_modules/scr-proto/proto/wappalyzer/wappalyzer.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);
const wappalyzerGrpc = grpc.loadPackageDefinition(packageDefinition).wappalyzer;

const server = new grpc.Server();
server.addService(wappalyzerGrpc.Wappalyzer.service, {
  Analyze: analyze,
});
server.bind(`0.0.0.0:${config.grpc.port}`, grpc.ServerCredentials.createInsecure());
