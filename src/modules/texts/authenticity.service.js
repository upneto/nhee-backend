const db = require('../../database/connection');

const authenticityService = {
  /**
   * Calcula a nota de autenticidade baseada nos campos preenchidos pelo autor
   * Peso: 4 (40% da nota final)
   * @param {Object} text - Dados do texto com campos de autenticidade
   * @returns {Number} - Nota de 0 a 10
   */
  calculateAuthorAuthenticityScore(text) {
    let score = 0;
    let maxScore = 0;
    
    // Critério 1: É o autor (3 pontos)
    maxScore += 3;
    if (text.is_author) {
      score += 3;
    }
    
    // Critério 2: Tem vínculo institucional (3 pontos)
    maxScore += 3;
    if (text.has_institutional_link && text.institution_name) {
      score += 3;
    }
    
    // Critério 3: Tem afirmações verificáveis com fontes (4 pontos)
    maxScore += 4;
    if (text.has_verifiable_claims && text.sources && text.sources.length > 0) {
      // Pontuação proporcional ao número de fontes (máximo 4 pontos com 3+ fontes)
      const sourcesScore = Math.min(text.sources.length, 3) * (4/3);
      score += sourcesScore;
    }
    
    // Normalizar para escala de 0 a 10
    const normalizedScore = (score / maxScore) * 10;
    
    return Math.round(normalizedScore * 10) / 10; // Arredondar para 1 casa decimal
  },

  /**
   * Busca a média de avaliações de usuários para um texto
   * Peso: 6 (60% da nota final)
   * @param {String} textId - ID do texto
   * @returns {Number} - Nota média de 0 a 10, ou 6 se não houver avaliações
   */
  async getUserRatingsAverage(textId) {
    const result = await db.query(
      `SELECT COALESCE(AVG(rating), 6) as average_rating, COUNT(*) as ratings_count
       FROM authenticity_ratings
       WHERE text_id = $1`,
      [textId]
    );
    
    const { average_rating, ratings_count } = result.rows[0];
    
    // Se não houver avaliações, retornar 6 como padrão
    if (ratings_count === 0) {
      return { average: 6, count: 0 };
    }
    
    return { 
      average: Math.round(average_rating * 10) / 10,
      count: parseInt(ratings_count)
    };
  },

  /**
   * Calcula a nota final do texto (ponderada)
   * Fórmula: (nota_autor * 0.4) + (nota_usuarios * 0.6)
   * @param {Object} text - Dados do texto
   * @returns {Object} - Objeto com todas as notas
   */
  async calculateFinalScore(text) {
    const authorScore = this.calculateAuthorAuthenticityScore(text);
    const userRatings = await this.getUserRatingsAverage(text.id);
    
    const finalScore = (authorScore * 0.4) + (userRatings.average * 0.6);
    
    return {
      author_score: authorScore,
      users_average: userRatings.average,
      users_count: userRatings.count,
      final_score: Math.round(finalScore * 10) / 10,
      has_user_ratings: userRatings.count > 0
    };
  },

  /**
   * Cria ou atualiza uma avaliação de autenticidade
   * @param {String} textId - ID do texto
   * @param {String} userId - ID do usuário avaliador
   * @param {Number} rating - Nota de 1 a 10
   */
  async rateText(textId, userId, rating) {
    // Verificar se o usuário é o autor do texto
    const result = await db.query(
      `SELECT AVG(rating) as average_rating, COUNT(*) as ratings_count
       FROM authenticity_ratings
       WHERE text_id = $1`,
      [textId]
    );

    let { average_rating, ratings_count } = result.rows[0];
    ratings_count = parseInt(ratings_count);

    // Se não houver avaliações, retornar 6 como padrão
    if (!ratings_count || ratings_count === 0 || average_rating === null) {
      return { average: 6, count: 0 };
    }
    
    // Inserir ou atualizar avaliação
      const rateResult = await db.query(
      `INSERT INTO authenticity_ratings (text_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (text_id, user_id)
       DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [textId, userId, rating]
    );
    
      return rateResult.rows[0];
  },

  /**
   * Busca a avaliação de um usuário específico para um texto
   * @param {String} textId - ID do texto
   * @param {String} userId - ID do usuário
   */
  async getUserRating(textId, userId) {
    const result = await db.query(
      'SELECT * FROM authenticity_ratings WHERE text_id = $1 AND user_id = $2',
      [textId, userId]
    );
    
    return result.rows[0] || null;
  },

  /**
   * Remove uma avaliação
   * @param {String} textId - ID do texto
   * @param {String} userId - ID do usuário
   */
  async deleteRating(textId, userId) {
    const result = await db.query(
      'DELETE FROM authenticity_ratings WHERE text_id = $1 AND user_id = $2 RETURNING *',
      [textId, userId]
    );
    
    return result.rows[0];
  }
};

module.exports = authenticityService;
