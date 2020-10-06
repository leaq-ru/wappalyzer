const pino = require('pino');
const config = require('../config/env');

module.exports = pino({
  prettyPrint: true,
  level: config.loglevel,
});
