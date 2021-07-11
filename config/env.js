module.exports = {
  grpc: {
    port: process.env.GRPC_PORT,
  },
  loglevel: process.env.LOGLEVEL,
  stan: {
    clusterId: process.env.STAN_CLUSTERID,
    subjectCompanyNew: process.env.STAN_SUBJECTCOMPANYNEW,
    subjectAnalyzeResult: process.env.STAN_SUBJECTANALYZERESULT,
  },
  nats: {
    url: process.env.NATS_URL,
  },
  serviceName: 'wappalyzer',
};
