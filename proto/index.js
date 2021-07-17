const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
  './node_modules/proto/proto/wappalyzer/wappalyzer.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);
const wappalyzerGrpc = grpc.loadPackageDefinition(packageDefinition).wappalyzer;

module.exports = {
  wappalyzerGrpc,
};
