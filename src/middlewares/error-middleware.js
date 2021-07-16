const ApiError = require('../exceptions/api-error');
const logger = require('../logger');

//Error handler
module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    logger.error(`${err.message}: ${err.stack}`);
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: `Some unknown error` });
};
