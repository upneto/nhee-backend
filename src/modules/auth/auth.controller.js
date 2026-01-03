const authService = require('./auth.service');

const authController = {
  async register(req, res, next) {
    try {
      const { username, email, password, name, institution, bio } = req.body;
      
      const result = await authService.register({
        username,
        email,
        password,
        name,
        institution,
        bio
      });
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      const result = await authService.login(username, password);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      // Logout é gerenciado no frontend (remover token)
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      await authService.forgotPassword(email);
      
      res.json({ message: 'Email de recuperação enviado' });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      
      await authService.resetPassword(token, password);
      
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async validateToken(req, res, next) {
    try {
      // Se chegou aqui, o token é válido (middleware auth)
      res.json({ valid: true, user: req.user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
