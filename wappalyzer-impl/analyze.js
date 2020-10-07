const dns = require('dns');
const { promisify } = require('util');
const logger = require('../logger');
const waManager = require('../wa-manager');

module.exports = async (call, cb) => {
  try {
    await promisify(dns.lookup)(new URL(call.request.url).hostname);

    const site = await waManager.get().open(call.request.url, {});
    const results = await site.analyze();

    cb(null, results);
  } catch (e) {
    logger.error(e);
    cb(e, null);
  }
};
