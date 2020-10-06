const health = require('grpc-health-check');
const waManager = require('../wa-manager');

const status = {
  serving: 1,
  notServing: 2,
};

module.exports = class Healthz extends health.Implementation {
  constructor() {
    const statusMap = {
      '': status.notServing,
    };

    super(statusMap);
    this.statusMap = statusMap;

    this.initLoopCheck();
  }

  async initLoopCheck() {
    while (!waManager.isStarted()) {
      await new Promise(((resolve) => setTimeout(resolve, 1000)));
      this.statusMap[''] = waManager.isStarted() ? status.serving : status.notServing;
    }
  }
};
