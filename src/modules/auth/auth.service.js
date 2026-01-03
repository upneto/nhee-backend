const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../database/connection');

const authService = {
  async register(userData) {
    const { username, email, password, name, institution, bio } = userData;
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Inserir usuário
    const result = await db.query(
      `INSERT INTO users (username, email, password, name, institution, bio)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, name, institution, bio, created_at`,
      [username, email, hashedPassword, name, institution, bio]
    );
    
    const user = result.rows[0];
    
    // Gerar token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    return { token, user };
  },

  async login(username, password) {
    // Buscar usuário
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    const user = result.rows[0];
    
    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    // Gerar token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Remover senha do retorno
    delete user.password;
    
    return { token, user };
  },

  async forgotPassword(email) {
    // Buscar usuário
    const result = await db.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      // Por segurança, não revelar se o email existe
      return;
    }
    
    const user = result.rows[0];
    
    // TODO: Gerar token de reset e enviar email
    // Por enquanto, apenas simulação
    console.log(`Reset password link para ${user.email}`);
  },

  async resetPassword(token, newPassword) {
    // TODO: Validar token de reset
    // Por enquanto, apenas simulação
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha (implementar validação de token)
    console.log('Senha resetada');
  }
};

module.exports = authService;
