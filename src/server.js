const app = require('./app');
const db = require('./database/connection');
const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 3000;

// Validar variáveis de ambiente críticas
function validateEnvironment() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    logger.error('ERRO CRÍTICO: JWT_SECRET não definido ou muito curto (mínimo 32 caracteres)');
    logger.error('Configure JWT_SECRET no arquivo .env');
    process.exit(1);
  }

  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    logger.error('ERRO: Variáveis de ambiente do banco de dados não configuradas');
    process.exit(1);
  }

  logger.info('Variáveis de ambiente validadas');
}

// Testar conexão com banco de dados
async function testDatabaseConnection() {
  try {
    await db.query('SELECT NOW()');
    logger.info('Banco de dados conectado');
  } catch (error) {
    logger.error('Erro ao conectar no banco de dados:', error.message);
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  validateEnvironment();
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    logger.info(`Servidor rodando na porta ${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
  });
}

startServer();
