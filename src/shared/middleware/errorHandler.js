const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error:', { message: err.message, stack: err.stack });
  } else {
    // Em produção, log apenas mensagem sem stack trace
    logger.error('Error:', err.message);
  }

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.details || err.message
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }

  // Erro de banco de dados
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      error: 'Registro duplicado',
      ...(process.env.NODE_ENV === 'development' && { details: err.detail })
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Referência inválida'
    });
  }

  // Erro padrão - não expor detalhes em produção
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Erro interno do servidor'
    : (err.message || 'Erro interno do servidor');

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
