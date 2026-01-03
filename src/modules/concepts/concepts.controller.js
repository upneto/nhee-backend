const conceptsService = require('./concepts.service');

const conceptsController = {
  async list(req, res, next) {
    try {
      const concepts = await conceptsService.list();
      res.json(concepts);
    } catch (error) {
      next(error);
    }
  },

  async getMap(req, res, next) {
    try {
      const mapData = await conceptsService.getMap();
      res.json(mapData);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = conceptsController;
