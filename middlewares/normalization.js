const _ = require('lodash');

const normalizeRes = (req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    // Do nothing if response from error handler
    // if (_.get(data, 'result.error', null)) return next();

    const neededUpdateData = (data) => {
      return _.isArray(data)
          || _.isBoolean(data)
          || _.isString(data)
          || _.isInteger(data)
          || !_.get(data, 'result', null);
    }
    if (neededUpdateData(data)) {
      data = { result: data };
    }
    res.send = oldSend;
    return res.send(data);
  }
  next();
}

const normalizeReq = (req, res, next) => {
  // Here will be triggered first before you can handle the api
  // if you want to process pre-data of req, please do it here
  // e.g: handle auth of req, restrict req or somethings
  next();
}

module.exports = {
  normalizeRes,
  normalizeReq
};