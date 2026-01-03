const db = require('../../database/connection');

const textsService = {
  async list(filters) {
    const { search, area, type, concept, page, limit } = filters;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT t.*, u.username, u.name as author_name,
             AVG(ar.rating) as authenticity,
             COUNT(DISTINCT q.id) as questions_count
      FROM texts t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN authenticity_ratings ar ON t.id = ar.text_id
      LEFT JOIN questions q ON t.id = q.text_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (search) {
      query += ` AND (t.title ILIKE $${paramCount} OR t.content ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    if (area) {
      query += ` AND t.area = $${paramCount}`;
      params.push(area);
      paramCount++;
    }
    
    if (type) {
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }
    
    query += ` GROUP BY t.id, u.username, u.name ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Count total
    const countResult = await db.query('SELECT COUNT(*) FROM texts');
    const total = parseInt(countResult.rows[0].count);
    
    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async get(id) {
    const result = await db.query(
      `SELECT t.*, u.username, u.name as author_name,
              AVG(ar.rating) as authenticity
       FROM texts t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN authenticity_ratings ar ON t.id = ar.text_id
       WHERE t.id = $1
       GROUP BY t.id, u.username, u.name`,
      [id]
    );
    
    return result.rows[0];
  },

  async create(textData) {
    const { user_id, title, content, area, type, author, institution, references } = textData;
    
    const result = await db.query(
      `INSERT INTO texts (user_id, title, content, area, type, author, institution, references)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [user_id, title, content, area, type, author, institution, references]
    );
    
    return result.rows[0];
  },

  async update(id, userId, textData) {
    // Verificar se o texto pertence ao usuário
    const check = await db.query('SELECT user_id FROM texts WHERE id = $1', [id]);
    
    if (check.rows.length === 0) {
      const error = new Error('Texto não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    if (check.rows[0].user_id !== userId) {
      const error = new Error('Você não tem permissão para editar este texto');
      error.statusCode = 403;
      throw error;
    }
    
    const { title, content, area, type, author, institution, references } = textData;
    
    const result = await db.query(
      `UPDATE texts 
       SET title = $1, content = $2, area = $3, type = $4, 
           author = $5, institution = $6, references = $7
       WHERE id = $8
       RETURNING *`,
      [title, content, area, type, author, institution, references, id]
    );
    
    return result.rows[0];
  },

  async delete(id, userId) {
    // Verificar se o texto pertence ao usuário
    const check = await db.query('SELECT user_id FROM texts WHERE id = $1', [id]);
    
    if (check.rows.length === 0) {
      const error = new Error('Texto não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    if (check.rows[0].user_id !== userId) {
      const error = new Error('Você não tem permissão para deletar este texto');
      error.statusCode = 403;
      throw error;
    }
    
    await db.query('DELETE FROM texts WHERE id = $1', [id]);
  },

  async getByUser(userId) {
    const result = await db.query(
      `SELECT t.*, AVG(ar.rating) as authenticity,
              COUNT(DISTINCT q.id) as questions_count
       FROM texts t
       LEFT JOIN authenticity_ratings ar ON t.id = ar.text_id
       LEFT JOIN questions q ON t.id = q.text_id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [userId]
    );
    
    return result.rows;
  },

  async evaluate(textId, userId, rating) {
    // Upsert (inserir ou atualizar)
    const result = await db.query(
      `INSERT INTO authenticity_ratings (text_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (text_id, user_id)
       DO UPDATE SET rating = $3
       RETURNING *`,
      [textId, userId, rating]
    );
    
    // Calcular nova média
    const avgResult = await db.query(
      'SELECT AVG(rating) as average FROM authenticity_ratings WHERE text_id = $1',
      [textId]
    );
    
    return {
      rating: result.rows[0],
      average: parseFloat(avgResult.rows[0].average)
    };
  }
};

module.exports = textsService;
