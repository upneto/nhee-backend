const questionsService = require('./questions.service');
const domainValidator = require('../../shared/middleware/domainValidator');
const { sanitizeObject, validateLength, validateCharacters } = require('../../shared/sanitize');

const questionsController = {
  async list(req, res, next) {
    try {
      const { textId } = req.params;
      const questions = await questionsService.list(textId);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { textId } = req.params;
      const userId = req.user.id;
      const { type, content } = req.body;
      
      // Validar comprimento do conteúdo
      if (!validateLength(content, 10, 5000)) {
        return res.status(400).json({ error: 'O conteúdo deve ter entre 10 e 5000 caracteres' });
      }
      
      // Validar caracteres perigosos
      if (!validateCharacters(content)) {
        return res.status(400).json({ error: 'O conteúdo contém caracteres não permitidos' });
      }
      
      // Validar tipo de contribuição
      const validation = await domainValidator.validate(
        'question_types',
        type,
        'Tipo de contribuição',
        true
      );
      
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
      
      // Sanitizar dados de entrada
      const sanitizedBody = sanitizeObject(req.body);
      
      const questionData = { ...sanitizedBody, text_id: textId, user_id: userId };
      const question = await questionsService.create(questionData);
      
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      await questionsService.delete(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = questionsController;
