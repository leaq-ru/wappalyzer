const randomUseragent = require('random-useragent');
const Wappalyzer = require('wappalyzer');

let started = false;
let wa = null;

module.exports = {
  async start() {
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
    started = true;
  },
  isStarted() {
    return started;
  },
  get() {
    return wa;
  },
};
