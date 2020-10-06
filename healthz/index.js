const health = require('grpc-health-check');
const waManager = require('../wa-manager');

module.exports = class Healthz extends health.Implementation {
  constructor() {
    const statusMap = {
      '': 'NOT_SERVING',
    };

    super(statusMap);
    this.statusMap = statusMap;

    this.initLoopCheck();
  }

  async initLoopCheck() {
    while (!waManager.isStarted()) {
      await new Promise(((resolve) => setTimeout(resolve, 1000)));
      this.statusMap[''] = waManager.isStarted() ? 'SERVING' : 'NOT_SERVING';
    }
  }
};
