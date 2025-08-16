const winston = require('winston');
const path = require('path');
const config = require('../../config/development.json');

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');
require('fs').mkdirSync(logDir, { recursive: true });

// Define log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan'
  }
};

winston.addColors(customLevels.colors);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging?.level || 'info',
  levels: customLevels.levels,
  format: winston.format.errors({ stack: true }),
  defaultMeta: {
    service: config.app.name || 'RideReserve API',
    environment: config.app.environment || 'development'
  },
  transports: []
});

// Console transport (if enabled)
if (config.logging?.console?.enabled !== false) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: config.logging?.level || 'info'
  }));
}

// File transport (if enabled)
if (config.logging?.file?.enabled) {
  // General log file
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'app.log'),
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true
  }));

  // Error log file
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true
  }));

  // HTTP log file
  logger.add(new winston.transports.File({
    filename: path.join(logDir, 'http.log'),
    level: 'http',
    format: fileFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 3,
    tailable: true
  }));
}

// Helper methods for structured logging
logger.logRequest = (req, res, duration) => {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('user-agent'),
    ip: req.ip,
    userId: req.user?.id
  });
};

logger.logError = (error, req = null) => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    code: error.code
  };

  if (req) {
    errorInfo.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id
    };
  }

  logger.error('Application Error', errorInfo);
};

logger.logDatabase = (operation, table, duration, error = null) => {
  const logData = {
    operation,
    table,
    duration: `${duration}ms`
  };

  if (error) {
    logger.error('Database Error', { ...logData, error: error.message });
  } else {
    logger.debug('Database Operation', logData);
  }
};

logger.logBusiness = (event, data = {}) => {
  logger.info('Business Event', {
    event,
    ...data,
    timestamp: new Date().toISOString()
  });
};

// Production environment adjustments
if (config.app.environment === 'production') {
  // Reduce console logging in production
  logger.transports.forEach(transport => {
    if (transport.name === 'console') {
      transport.level = 'warn';
    }
  });
}

module.exports = logger;