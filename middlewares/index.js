const { normalizeRes, normalizeReq } = require('./normalization');
const errorHandler = require('./error-handler');

module.exports = {
  normalizeRes,
  errorHandler,
  normalizeReq
}