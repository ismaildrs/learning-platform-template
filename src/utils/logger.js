const winston = require('winston');
const path = require('path');
require('dotenv').config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(process.env.LOG_PATH || 'logs', 'combined.log')
    }),
    new winston.transports.File({
      level: 'error',
      filename: path.join(process.env.LOG_PATH || 'logs', 'error.log')
    })
  ]
});

// On verifie si on'est on environnement de production ou de développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;