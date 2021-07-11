const dns = require('dns');
const { promisify } = require('util');
const randomUseragent = require('random-useragent');
const Wappalyzer = require('wappalyzer');
const logger = require('../logger');

const lookup = promisify(dns.lookup);

module.exports = async (url) => {
  try {
    logger.debug('got url to analyze, url=', url);

    await lookup(new URL(url).hostname);

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

    let wa;
    let results;
    let site;
    try {
      wa = new Wappalyzer(options);
      await wa.init();

      site = await wa.open(url, {});

      results = await site.analyze();
    } finally {
      if (site) {
        await site.destroy();
      }
      if (wa) {
        await wa.destroy();
      }
    }

    return results || {};
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
