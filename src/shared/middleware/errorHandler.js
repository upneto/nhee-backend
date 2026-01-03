const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

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
      details: err.detail
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: 'Referência inválida'
    });
  }

  // Erro padrão
  res.status(err.statusCode || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;
