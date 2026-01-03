const bcrypt = require('bcrypt');
const db = require('../../database/connection');

const usersService = {
  async getProfile(userId) {
    const result = await db.query(
      'SELECT id, username, email, name, institution, bio, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    return result.rows[0];
  },

  async updateProfile(userId, profileData) {
    const { name, email, institution, bio } = profileData;
    
    const result = await db.query(
      `UPDATE users 
       SET name = $1, email = $2, institution = $3, bio = $4
       WHERE id = $5
       RETURNING id, username, email, name, institution, bio, created_at`,
      [name, email, institution, bio, userId]
    );
    
    return result.rows[0];
  },

  async changePassword(userId, oldPassword, newPassword) {
    const result = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    
    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password);
    
    if (!isValid) {
      const error = new Error('Senha atual incorreta');
      error.statusCode = 400;
      throw error;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
  }
};

module.exports = usersService;
