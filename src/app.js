const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const logger = require('./shared/utils/logger');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const textRoutes = require('./modules/texts/texts.routes');
const questionRoutes = require('./modules/questions/questions.routes');
const userRoutes = require('./modules/users/users.routes');
const conceptRoutes = require('./modules/concepts/concepts.routes');
const contactRoutes = require('./modules/contact/contact.routes');
const domainRoutes = require('./modules/domains/domains.routes');

const errorHandler = require('./shared/middleware/errorHandler');
const { globalLimiter } = require('./shared/middleware/rateLimiter');

const app = express();

// Configuração CORS segura
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:8080'];
    
    // Permitir requisições sem origin (ex: mobile apps, Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares globais
app.use(helmet()); // Segurança
app.use(cors(corsOptions)); // CORS configurado
app.use(morgan('combined', { stream: logger.stream })); // Logging com Winston
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(globalLimiter); // Rate limiting global

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
const apiPrefix = process.env.API_PREFIX || '/api';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/texts`, textRoutes);
// app.use(`${apiPrefix}/questions`, questionRoutes); // Questões agora são sub-recurso de /texts
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/concepts`, conceptRoutes);
app.use(`${apiPrefix}/contact`, contactRoutes);
app.use(`${apiPrefix}/domains`, domainRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
