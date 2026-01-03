const domainsService = require('./domains.service');

const domainsController = {
  async getKnowledgeAreas(req, res, next) {
    try {
      const areas = await domainsService.getKnowledgeAreas();
      res.json(areas);
    } catch (error) {
      next(error);
    }
  },

  async getTextTypes(req, res, next) {
    try {
      const types = await domainsService.getTextTypes();
      res.json(types);
    } catch (error) {
      next(error);
    }
  },

  async getTextObjectives(req, res, next) {
    try {
      const objectives = await domainsService.getTextObjectives();
      res.json(objectives);
    } catch (error) {
      next(error);
    }
  },

  async getFoundationLevels(req, res, next) {
    try {
      const levels = await domainsService.getFoundationLevels();
      res.json(levels);
    } catch (error) {
      next(error);
    }
  },

  async getQuestionTypes(req, res, next) {
    try {
      const types = await domainsService.getQuestionTypes();
      res.json(types);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = domainsController;
