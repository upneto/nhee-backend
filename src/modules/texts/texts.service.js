const db = require('../../database/connection');
const authenticityService = require('./authenticity.service');
// Para usar OpenAI, troque para o serviço abaixo:
const { extractQuestionsFromText } = require('./ia.openai.service');

const textsService = {
  async list(filters) {
    const { search, area, type, concept, page, limit, sortBy, sortOrder } = filters;
    const offset = (page - 1) * limit;
    
    let query = `
            SELECT t.*, u.username, u.name as author_name,
              COUNT(DISTINCT q.id) as questions_count,
              STRING_AGG(DISTINCT c.name, ', ') as tags
      FROM texts t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN authenticity_ratings ar ON t.id = ar.text_id
      LEFT JOIN questions q ON t.id = q.text_id
      LEFT JOIN text_concepts tc ON t.id = tc.text_id
      LEFT JOIN concepts c ON tc.concept_id = c.id
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
    
    if (concept) {
      query += ` AND EXISTS (
        SELECT 1 FROM text_concepts tc 
        JOIN concepts c ON tc.concept_id = c.id 
        WHERE tc.text_id = t.id AND c.name ILIKE $${paramCount}
      )`;
      params.push(`%${concept}%`);
      paramCount++;
    }
    
    query += ` GROUP BY t.id, u.username, u.name`;
    
    // Adicionar ordenação
    if (sortBy) {
      const validSortFields = {
        'created_at': 't.created_at',
        'title': 't.title',
        'questions_count': 'questions_count',
        'authenticity_score': 'authenticity_score'
      };
      
      const sortFields = sortBy.split(',').map(field => {
        const trimmedField = field.trim();
        return validSortFields[trimmedField] || null;
      }).filter(field => field !== null);
      
      if (sortFields.length > 0) {
        const order = (sortOrder && sortOrder.toLowerCase() === 'asc') ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortFields.join(` ${order}, `)} ${order}`;
      } else {
        query += ` ORDER BY t.created_at DESC`;
      }
    } else {
      query += ` ORDER BY t.created_at DESC`;
    }
    
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Count total com os mesmos filtros aplicados
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) as count
      FROM texts t
      LEFT JOIN text_concepts tc ON t.id = tc.text_id
      LEFT JOIN concepts c ON tc.concept_id = c.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamNum = 1;
    
    if (search) {
      countQuery += ` AND (t.title ILIKE $${countParamNum} OR t.content ILIKE $${countParamNum})`;
      countParams.push(`%${search}%`);
      countParamNum++;
    }
    
    if (area) {
      countQuery += ` AND t.area = $${countParamNum}`;
      countParams.push(area);
      countParamNum++;
    }
    
    if (type) {
      countQuery += ` AND t.type = $${countParamNum}`;
      countParams.push(type);
      countParamNum++;
    }
    
    if (concept) {
      countQuery += ` AND EXISTS (
        SELECT 1 FROM text_concepts tc2 
        JOIN concepts c2 ON tc2.concept_id = c2.id 
        WHERE tc2.text_id = t.id AND c2.name ILIKE $${countParamNum}
      )`;
      countParams.push(`%${concept}%`);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);
    
    // Calcular autenticidade ponderada para cada texto
    const data = await Promise.all(result.rows.map(async (text) => {
      const authenticity = await authenticityService.calculateFinalScore(text);
      return {
        ...text,
        authenticity
      };
    }));

    return {
      data,
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
      `SELECT t.*, 
              u.username as author_username, 
              u.name as author_name,
              STRING_AGG(DISTINCT c.name, ', ') as tags,
              t.area as knowledge_area_code,
              t.type as text_type_code,
              t.objective as text_objective_code,
              t.foundation_level as foundation_level_code
       FROM texts t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN text_concepts tc ON t.id = tc.text_id
       LEFT JOIN concepts c ON tc.concept_id = c.id
       WHERE t.id = $1
       GROUP BY t.id, u.username, u.name`,
      [id]
    );
    
    const text = result.rows[0];
    
    if (!text) {
      return null;
    }
    
    // Calcular notas de autenticidade
    const scores = await authenticityService.calculateFinalScore(text);
    
    return {
      ...text,
      authenticity: scores
    };
  },

  async create(textData) {
    const { 
      user_id, title, content, area, type, author, institution, references, 
      objective, foundation_level, in_response_to_question_id, in_response_to_text_id,
      concepts,
      // Campos de autenticidade
      is_author, has_institutional_link, institution_name, has_verifiable_claims, sources
    } = textData;

    // 1. Grava o texto normalmente
    const result = await db.query(
      `INSERT INTO texts (
        user_id, title, content, area, type, author, institution, "references", 
        objective, foundation_level, in_response_to_question_id, in_response_to_text_id,
        is_author, has_institutional_link, institution_name, has_verifiable_claims, sources
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        user_id, title, content, area, type, author, institution, references, 
        objective, foundation_level, in_response_to_question_id || null, in_response_to_text_id || null,
        is_author || false, has_institutional_link || false, institution_name || null, 
        has_verifiable_claims || false, sources || null
      ]
    );

    const text = result.rows[0];

    // 2. Processar conceitos se fornecidos
    if (concepts && concepts.length > 0) {
      for (const conceptName of concepts) {
        const trimmedName = conceptName.trim();
        if (trimmedName) {
          // Tentar encontrar conceito existente (case-insensitive)
          let conceptResult = await db.query(
            'SELECT id FROM concepts WHERE LOWER(name) = LOWER($1)',
            [trimmedName]
          );

          let conceptId;

          if (conceptResult.rows.length > 0) {
            // Conceito já existe
            conceptId = conceptResult.rows[0].id;
          } else {
            // Criar novo conceito
            const newConcept = await db.query(
              'INSERT INTO concepts (name) VALUES ($1) RETURNING id',
              [trimmedName]
            );
            conceptId = newConcept.rows[0].id;
          }

          // Associar conceito ao texto
          await db.query(
            'INSERT INTO text_concepts (text_id, concept_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [text.id, conceptId]
          );
        }
      }
    }

    // 3. Chamar serviço de IA para extrair dúvidas
    let iaQuestions = [];
    try {
      iaQuestions = await extractQuestionsFromText(content);
    } catch (err) {
      // Fallback: ignora erro, segue sem dúvidas
      iaQuestions = [];
    }

    // 4. Gravar dúvidas extraídas (se houver)
    if (Array.isArray(iaQuestions) && iaQuestions.length > 0) {
      for (const q of iaQuestions) {
        // Espera-se: { categoria, duvida, conceito_relacionado, trecho_base }
        const categoria = q.categoria || 'gerada-ia';
        const duvida = q.duvida || '';
        const conceito = q.conceito_relacionado || '';
        const trecho = q.trecho_base || '';
        // Monta título e conteúdo para a questão
        const title = duvida.length > 80 ? duvida.slice(0, 77) + '...' : duvida;
        const contentQ = trecho ? duvida + '\n\nTrecho base: ' + trecho : duvida;
        const type = categoria;
        // Grava questão
        if (duvida) {
          await db.query(
            `INSERT INTO questions (text_id, user_id, title, content, type)
             VALUES ($1, $2, $3, $4, $5)`,
            [text.id, user_id, title, contentQ, type]
          );
        }
        // Grava conceito relacionado, se houver
        if (conceito) {
          // Cria conceito se não existir
          let conceptResult = await db.query(
            'SELECT id FROM concepts WHERE LOWER(name) = LOWER($1)',
            [conceito.trim()]
          );
          let conceptId;
          if (conceptResult.rows.length > 0) {
            conceptId = conceptResult.rows[0].id;
          } else {
            const newConcept = await db.query(
              'INSERT INTO concepts (name) VALUES ($1) RETURNING id',
              [conceito.trim()]
            );
            conceptId = newConcept.rows[0].id;
          }
          // Relaciona conceito ao texto
          await db.query(
            'INSERT INTO text_concepts (text_id, concept_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [text.id, conceptId]
          );
        }
      }
    }

    // 5. Calcular e adicionar nota de autenticidade
    const scores = await authenticityService.calculateFinalScore(text);

    return {
      ...text,
      authenticity: scores
    };
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
    
    const { 
      title, content, area, type, author, institution, references, 
      objective, foundation_level, concepts,
      // Campos de autenticidade
      is_author, has_institutional_link, institution_name, has_verifiable_claims, sources
    } = textData;
    
    const result = await db.query(
      `UPDATE texts 
       SET title = $1, content = $2, area = $3, type = $4, 
           author = $5, institution = $6, "references" = $7,
           objective = $8, foundation_level = $9,
           is_author = $10, has_institutional_link = $11, institution_name = $12,
           has_verifiable_claims = $13, sources = $14,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $15
       RETURNING *`,
      [
        title, content, area, type, author, institution, references, 
        objective, foundation_level,
        is_author || false, has_institutional_link || false, institution_name || null,
        has_verifiable_claims || false, sources || null,
        id
      ]
    );
    
    // Atualizar conceitos se fornecidos
    if (concepts !== undefined) {
      // Remover conceitos antigos
      await db.query('DELETE FROM text_concepts WHERE text_id = $1', [id]);
      
      // Adicionar novos conceitos
      if (concepts && concepts.length > 0) {
        for (const conceptName of concepts) {
          const trimmedName = conceptName.trim();
          if (trimmedName) {
            // Tentar encontrar conceito existente (case-insensitive)
            let conceptResult = await db.query(
              'SELECT id FROM concepts WHERE LOWER(name) = LOWER($1)',
              [trimmedName]
            );
            
            let conceptId;
            
            if (conceptResult.rows.length > 0) {
              // Conceito já existe
              conceptId = conceptResult.rows[0].id;
            } else {
              // Criar novo conceito
              const newConcept = await db.query(
                'INSERT INTO concepts (name) VALUES ($1) RETURNING id',
                [trimmedName]
              );
              conceptId = newConcept.rows[0].id;
            }
            
            // Associar conceito ao texto
            await db.query(
              'INSERT INTO text_concepts (text_id, concept_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
              [id, conceptId]
            );
          }
        }
      }
    }
    
    const updatedText = result.rows[0];
    
    // Calcular e adicionar nota de autenticidade
    const scores = await authenticityService.calculateFinalScore(updatedText);
    
    return {
      ...updatedText,
      authenticity: scores
    };
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
  },

  async getResponsesByQuestionId(questionId, filters = {}) {
    const { page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    
    // Buscar textos que são respostas à dúvida específica
    const query = `
      SELECT t.*, u.username, u.name as author_name,
             COALESCE(AVG(ar.rating), 0) as authenticity_score,
             COUNT(DISTINCT q.id) as questions_count,
             STRING_AGG(DISTINCT c.name, ', ') as tags
      FROM texts t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN authenticity_ratings ar ON t.id = ar.text_id
      LEFT JOIN questions q ON t.id = q.text_id
      LEFT JOIN text_concepts tc ON t.id = tc.text_id
      LEFT JOIN concepts c ON tc.concept_id = c.id
      WHERE t.in_response_to_question_id = $1
      GROUP BY t.id, u.username, u.name
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM texts
      WHERE in_response_to_question_id = $1
    `;
    
    const [textsResult, countResult] = await Promise.all([
      db.query(query, [questionId, limit, offset]),
      db.query(countQuery, [questionId])
    ]);
    
    const total = parseInt(countResult.rows[0].total);
    
    return {
      data: textsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
};

module.exports = textsService;
