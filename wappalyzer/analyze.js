const randomUseragent = require('random-useragent');
const pino = require('pino');
const Wappalyzer = require('wappalyzer');

const logger = pino({
  prettyPrint: true,
});

module.exports = async (call, cb) => {
  try {
    const options = {
      debug: false,
      delay: 500,
      headers: {},
      maxDepth: 3,
      maxUrls: 10,
      maxWait: 5000,
      recursive: true,
      probe: true,
      userAgent: randomUseragent.getRandom(),
      htmlMaxCols: 2000,
      htmlMaxRows: 2000,
    };

    const wa = new Wappalyzer(options);
    await wa.init();

    const site = await wa.open(call.request.url, {});
    const results = await site.analyze();

    const res = new AnalyzeResponse();

  } catch (e) {
    logger.error(e);
    cb(e, null);
  }
};
