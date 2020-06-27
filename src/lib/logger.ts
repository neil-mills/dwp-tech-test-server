import winston, { Logger } from 'winston';
import appRoot from 'app-root-path';

const logger: Logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: `${appRoot}/logs/app.log` }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
