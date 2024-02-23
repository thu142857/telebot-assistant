const moment = require('moment');

class HttpError extends Error {

  httpStatusCode;
  timestamp;

  constructor(httpStatusCode, message = null) {
    message = message || '';
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.timestamp = moment().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

}

module.exports = HttpError;