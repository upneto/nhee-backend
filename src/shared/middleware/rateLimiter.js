const rateLimit = require('express-rate-limit');

// Rate limiter para autenticação - proteção contra força bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo de 5 tentativas
  message: {
    error: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Conta requisições bem-sucedidas também
  handler: (req, res) => {
    res.status(429).json({
      error: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 / 60) + ' minutos'
    });
  }
});

// Rate limiter para registro - evitar spam de cadastros
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo de 3 registros por hora
  message: {
    error: 'Limite de registros atingido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Limite de registros atingido. Tente novamente em 1 hora.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 / 60) + ' minutos'
    });
  }
});

// Rate limiter para recuperação de senha - prevenir abuso
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // Máximo de 3 solicitações por hora
  message: {
    error: 'Muitas solicitações de recuperação de senha. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Muitas solicitações de recuperação de senha. Tente novamente em 1 hora.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000 / 60) + ' minutos'
    });
  }
});

// Rate limiter global - proteção geral da API
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo de 100 requisições por minuto
  message: {
    error: 'Muitas requisições. Por favor, aguarde um momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Muitas requisições. Por favor, aguarde um momento.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000) + ' segundos'
    });
  }
});

// Rate limiter para operações de escrita - criação/atualização
const writeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // Máximo de 20 operações de escrita por minuto
  message: {
    error: 'Muitas operações. Por favor, aguarde um momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

module.exports = {
  authLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  globalLimiter,
  writeLimiter
};
