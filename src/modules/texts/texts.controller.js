const textsService = require('./texts.service');
const domainValidator = require('../../shared/middleware/domainValidator');

const textsController = {
  async list(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        area: req.query.area,
        type: req.query.type,
        concept: req.query.concept,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      };
      
      const result = await textsService.list(filters);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const { id } = req.params;
      
      const text = await textsService.get(id);
      
      if (!text) {
        return res.status(404).json({ error: 'Texto não encontrado' });
      }
      
      res.json(text);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { area, type, objective, foundation_level } = req.body;
      
      // Validar campos de domínio
      const validation = await domainValidator.validateMultiple([
        { table: 'knowledge_areas', value: area, fieldName: 'Área do conhecimento', required: true },
        { table: 'text_types', value: type, fieldName: 'Tipo de texto', required: false },
        { table: 'text_objectives', value: objective, fieldName: 'Objetivo', required: false },
        { table: 'foundation_levels', value: foundation_level, fieldName: 'Nível de fundamentação', required: false }
      ]);
      
      if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
      }
      
      const textData = { ...req.body, user_id: userId };
      const text = await textsService.create(textData);
      
      res.status(201).json(text);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { area, type, objective, foundation_level } = req.body;
      
      // Validar campos de domínio
      const validation = await domainValidator.validateMultiple([
        { table: 'knowledge_areas', value: area, fieldName: 'Área do conhecimento', required: true },
        { table: 'text_types', value: type, fieldName: 'Tipo de texto', required: false },
        { table: 'text_objectives', value: objective, fieldName: 'Objetivo', required: false },
        { table: 'foundation_levels', value: foundation_level, fieldName: 'Nível de fundamentação', required: false }
      ]);
      
      if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
      }
      
      const text = await textsService.update(id, userId, req.body);
      
      res.json(text);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await textsService.delete(id, userId);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async getMyTexts(req, res, next) {
    try {
      const userId = req.user.id;
      
      const texts = await textsService.getByUser(userId);
      
      res.json(texts);
    } catch (error) {
      next(error);
    }
  },

  async evaluate(req, res, next) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const userId = req.user.id;
      
      const result = await textsService.evaluate(id, userId, rating);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = textsController;
