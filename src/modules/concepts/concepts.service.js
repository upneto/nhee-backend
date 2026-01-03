const db = require('../../database/connection');

const conceptsService = {
  async list() {
    const result = await db.query(
      'SELECT * FROM concepts ORDER BY name ASC'
    );
    
    return result.rows;
  },

  async getMap() {
    // Buscar conceitos e suas relações com textos
    const conceptsResult = await db.query(`
      SELECT c.*, COUNT(tc.text_id) as text_count
      FROM concepts c
      LEFT JOIN text_concepts tc ON c.id = tc.concept_id
      GROUP BY c.id
      ORDER BY text_count DESC
    `);
    
    // Buscar relações entre conceitos (baseado em textos compartilhados)
    const relationsResult = await db.query(`
      SELECT tc1.concept_id as source, tc2.concept_id as target, COUNT(*) as weight
      FROM text_concepts tc1
      JOIN text_concepts tc2 ON tc1.text_id = tc2.text_id
      WHERE tc1.concept_id < tc2.concept_id
      GROUP BY tc1.concept_id, tc2.concept_id
      HAVING COUNT(*) > 0
    `);
    
    return {
      nodes: conceptsResult.rows,
      links: relationsResult.rows
    };
  }
};

module.exports = conceptsService;
