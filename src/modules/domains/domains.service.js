const db = require('../../database/connection');

const domainsService = {
  // Áreas do Conhecimento
  async getKnowledgeAreas() {
    const result = await db.query(
      `SELECT id, code, name, description, display_order
       FROM knowledge_areas
       WHERE is_active = true
       ORDER BY display_order, name`
    );
    return result.rows;
  },

  // Tipos de Texto
  async getTextTypes() {
    const result = await db.query(
      `SELECT id, code, name, description, display_order
       FROM text_types
       WHERE is_active = true
       ORDER BY display_order, name`
    );
    return result.rows;
  },

  // Objetivos de Texto
  async getTextObjectives() {
    const result = await db.query(
      `SELECT id, code, name, description, display_order
       FROM text_objectives
       WHERE is_active = true
       ORDER BY display_order, name`
    );
    return result.rows;
  },

  // Níveis de Fundamentação
  async getFoundationLevels() {
    const result = await db.query(
      `SELECT id, code, name, description, display_order
       FROM foundation_levels
       WHERE is_active = true
       ORDER BY display_order, name`
    );
    return result.rows;
  },

  // Tipos de Dúvida/Contribuição
  async getQuestionTypes() {
    const result = await db.query(
      `SELECT id, code, name, description, display_order
       FROM question_types
       WHERE is_active = true
       ORDER BY display_order, name`
    );
    return result.rows;
  },

  // Validar se um código existe em uma tabela de domínio
  async validateDomainValue(table, code) {
    const result = await db.query(
      `SELECT id FROM ${table} WHERE code = $1 AND is_active = true`,
      [code]
    );
    return result.rows.length > 0;
  }
};

module.exports = domainsService;
