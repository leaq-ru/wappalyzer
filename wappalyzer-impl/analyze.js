const dns = require('dns');
const { promisify } = require('util');
const randomUseragent = require('random-useragent');
const Wappalyzer = require('wappalyzer');
const logger = require('../logger');

module.exports = async (call, cb) => {
  logger.debug('got url to analyze, url=', call.request.url);

  let wa;
  try {
    await promisify(dns.lookup)(new URL(call.request.url).hostname);

    const options = {
      debug: false,
      delay: 100,
      headers: {},
      maxDepth: 1,
      maxUrls: 3,
      maxWait: 5000,
      recursive: false,
      probe: true,
      userAgent: randomUseragent.getRandom(),
      htmlMaxCols: 2000,
      htmlMaxRows: 2000,
    };

    wa = new Wappalyzer(options);
    await wa.init();

    const site = await wa.open(call.request.url, {});

    const results = await site.analyze();

    cb(null, results);
  } catch (e) {
    logger.error(e);
    cb(e, null);
  } finally {
    await wa.destroy();
  }
};
