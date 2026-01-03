const app = require('./app');
const db = require('./database/connection');

const PORT = process.env.PORT || 3000;

// Testar conexão com banco de dados
async function testDatabaseConnection() {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Banco de dados conectado');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco de dados:', error.message);
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
  });
}

startServer();
