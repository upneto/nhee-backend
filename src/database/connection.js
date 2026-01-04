const { Pool } = require('pg');
const logger = require('../shared/utils/logger');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  client_encoding: 'UTF8',
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo de espera antes de fechar conexão ociosa
  connectionTimeoutMillis: 2000, // Tempo de espera para obter conexão do pool
});

pool.on('connect', () => {
  logger.debug('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('Erro inesperado no PostgreSQL:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
