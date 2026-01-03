const questionsService = require('./questions.service');

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
      const questionData = { ...req.body, text_id: textId, user_id: userId };
      
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
