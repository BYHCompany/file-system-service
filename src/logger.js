const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, printf } = format;

const devFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} | [${level}] : ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), devFormat),
    }),
  );
}

module.exports = logger;
