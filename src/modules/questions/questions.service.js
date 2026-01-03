const db = require('../../database/connection');

const questionsService = {
  async list(textId) {
    const result = await db.query(
      `SELECT q.*, u.username, u.name as author_name
       FROM questions q
       LEFT JOIN users u ON q.user_id = u.id
       WHERE q.text_id = $1
       ORDER BY q.created_at DESC`,
      [textId]
    );
    
    return result.rows;
  },

  async create(questionData) {
    const { text_id, user_id, title, content, type } = questionData;
    
    const result = await db.query(
      `INSERT INTO questions (text_id, user_id, title, content, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [text_id, user_id, title, content, type]
    );
    
    return result.rows[0];
  },

  async delete(id, userId) {
    const check = await db.query('SELECT user_id FROM questions WHERE id = $1', [id]);
    
    if (check.rows.length === 0) {
      const error = new Error('Questão não encontrada');
      error.statusCode = 404;
      throw error;
    }
    
    if (check.rows[0].user_id !== userId) {
      const error = new Error('Você não tem permissão para deletar esta questão');
      error.statusCode = 403;
      throw error;
    }
    
    await db.query('DELETE FROM questions WHERE id = $1', [id]);
  }
};

module.exports = questionsService;
