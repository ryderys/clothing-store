const winston = require("winston");
const path = require("path");

// Custom format for better readability
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    
    return msg;
});

// Create logs directory if it doesn't exist
const logDir = 'logs';

// Configure different log formats for different environments
const formats = {
    development: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        customFormat
    ),
    production: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    )
};

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: formats[process.env.NODE_ENV || 'development'],
    transports: [
        // Console transport for all environments
        new winston.transports.Console(),
        
        // File transports for production
        ...(process.env.NODE_ENV === 'production' ? [
            new winston.transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5
            }),
            new winston.transports.File({
                filename: path.join(logDir, 'combined.log'),
                maxsize: 5242880, // 5MB
                maxFiles: 5
            })
        ] : [])
    ]
});

// Add request metadata to logs
logger.addRequestMetadata = (req) => {
    return {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent')
    };
};

// Helper methods for common logging scenarios
logger.logAPIRequest = (req, message) => {
    logger.info(message, logger.addRequestMetadata(req));
};

logger.logAPIError = (req, error) => {
    logger.error(error.message, {
        ...logger.addRequestMetadata(req),
        stack: error.stack,
        status: error.status || 500
    });
};

logger.logDatabaseOperation = (operation, details) => {
    logger.debug(`Database ${operation}`, { details });
};

logger.logPaymentOperation = (operation, details) => {
    logger.info(`Payment ${operation}`, { details });
};

module.exports = { logger };