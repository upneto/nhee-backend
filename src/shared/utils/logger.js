const winston = require('winston');
const path = require('path');

// Definir níveis de log personalizados com cores
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(logColors);

// Formato para desenvolvimento (colorido e legível)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Formato para produção (JSON estruturado)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Determinar formato baseado no ambiente
const logFormat = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;

// Transports (destinos dos logs)
const transports = [
  // Console
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  }),
];

// Em produção, adicionar logs em arquivo
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Arquivo para todos os logs
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Arquivo apenas para erros
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Criar logger
const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports,
  // Não sair do processo em caso de erro
  exitOnError: false,
});

// Adicionar método de stream para Morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
