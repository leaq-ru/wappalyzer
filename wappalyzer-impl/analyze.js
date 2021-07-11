const analyze = require('../analyze');
const logger = require('../logger');

module.exports = async (call, cb) => {
  try {
    const res = await analyze(call.request.url);
    cb(null, res);
  } catch (e) {
    logger.error(e);
    cb(e, null);
  }
};
