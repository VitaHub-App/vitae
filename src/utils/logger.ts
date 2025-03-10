// src/utils/logger.ts
import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors, colorize } = format;

// Define custom log levels and colors
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    success: 3,
    info: 4,
    debug: 5
  },
  colors: {
    fatal: 'bold red',
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'cyan',
    debug: 'white'
  }
};

// Add custom colors to Winston
winston.addColors(customLevels.colors);

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    colorize({ colors: customLevels.colors }),
    devFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        devFormat
      )
    })
  ]
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File({ 
    filename: 'logs/error.log', 
    level: 'error',
    format: format.json()
  }));
  logger.add(new transports.File({ 
    filename: 'logs/combined.log',
    format: format.json()
  }));
}

// Create shorthand methods
const loggerWithMethods = Object.assign(logger, {
  success: (message: string, meta?: any) => logger.log({ level: 'success', message, ...meta }),
  fatal: (message: string, meta?: any) => logger.log({ level: 'fatal', message, ...meta })
});

export default loggerWithMethods;
