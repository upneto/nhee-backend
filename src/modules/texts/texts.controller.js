const textsService = require('./texts.service');
const authenticityService = require('./authenticity.service');
const domainValidator = require('../../shared/middleware/domainValidator');
const { sanitizeObject, validateLength, validateCharacters } = require('../../shared/sanitize');

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
      const { area, type, objective, foundation_level, title, content } = req.body;
      
      // Validar comprimento do título e conteúdo
      if (!validateLength(title, 10, 150)) {
        return res.status(400).json({ error: 'O título deve ter entre 10 e 150 caracteres' });
      }
      
      if (!validateLength(content, 200, 50000)) {
        return res.status(400).json({ error: 'O conteúdo deve ter entre 200 e 50000 caracteres' });
      }
      
      // Validar caracteres perigosos
      if (!validateCharacters(title) || !validateCharacters(content)) {
        return res.status(400).json({ error: 'O texto contém caracteres não permitidos' });
      }
      
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
      
      // Sanitizar dados de entrada para prevenir XSS
      const sanitizedBody = sanitizeObject(req.body);
      
      const textData = { ...sanitizedBody, user_id: userId };
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
      const { area, type, objective, foundation_level, title, content } = req.body;
      
      // Validar comprimento do título e conteúdo se fornecidos
      if (title && !validateLength(title, 10, 150)) {
        return res.status(400).json({ error: 'O título deve ter entre 10 e 150 caracteres' });
      }
      
      if (content && !validateLength(content, 200, 50000)) {
        return res.status(400).json({ error: 'O conteúdo deve ter entre 200 e 50000 caracteres' });
      }
      
      // Validar caracteres perigosos
      if (title && !validateCharacters(title)) {
        return res.status(400).json({ error: 'O título contém caracteres não permitidos' });
      }
      
      if (content && !validateCharacters(content)) {
        return res.status(400).json({ error: 'O conteúdo contém caracteres não permitidos' });
      }
      
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
      
      // Sanitizar dados de entrada para prevenir XSS
      const sanitizedBody = sanitizeObject(req.body);
      
      const text = await textsService.update(id, userId, sanitizedBody);
      
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
  },

  async getResponsesByQuestionId(req, res, next) {
    try {
      const { questionId } = req.params;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };
      
      const result = await textsService.getResponsesByQuestionId(questionId, filters);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async rateText(req, res, next) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const userId = req.user.id;
      
      // Validar rating
      if (!rating || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'A nota deve estar entre 1 e 10' });
      }
      
      const result = await authenticityService.rateText(id, userId, parseInt(rating));
      
      res.json({
        message: 'Avaliação registrada com sucesso',
        rating: result
      });
    } catch (error) {
      if (error.message === 'Você não pode avaliar seu próprio texto') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Texto não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      next(error);
    }
  },

  async getUserRating(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const rating = await authenticityService.getUserRating(id, userId);
      
      res.json({
        rating: rating ? rating.rating : null,
        hasRated: !!rating
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteRating(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const deleted = await authenticityService.deleteRating(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }
      
      res.json({ message: 'Avaliação removida com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = textsController;
