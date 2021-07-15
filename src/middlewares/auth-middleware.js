const ApiError = require('../exceptions/api-error');

module.exports = function (req, res, next) {
  try {
    const apiHeader = req.headers.api;

    if (!apiHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const isValid = apiHeader === process.env.API_TOKEN;

    if (!isValid) {
      return next(ApiError.UnauthorizedError());
    }

    next();
  } catch (error) {
    next(ApiError.UnauthorizedError());
  }
};
