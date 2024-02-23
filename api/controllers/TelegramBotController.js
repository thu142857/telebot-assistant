const _ = require('lodash');

const getMessage = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const mes = _.get(req.body, 'message.text', _.get(req.body, 'message.caption', 'Channel Post or edited message'));
    console.log(mes);
  } else {
    console.log(req.body);
  }
  res.status(200).send();
}

module.exports = {
  getMessage
}