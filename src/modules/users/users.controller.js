const usersService = require('./users.service');

const usersController = {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await usersService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await usersService.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      
      await usersService.changePassword(userId, oldPassword, newPassword);
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = usersController;
