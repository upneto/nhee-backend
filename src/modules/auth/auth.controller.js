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
      
      // Enviar token como HttpOnly cookie
      res.cookie('authToken', result.token, {
        httpOnly: true, // Não acessível via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
        sameSite: 'strict', // Proteção CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });
      
      // Retornar apenas dados do usuário (sem token)
      res.status(201).json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      const result = await authService.login(username, password);
      
      // Enviar token como HttpOnly cookie
      res.cookie('authToken', result.token, {
        httpOnly: true, // Não acessível via JavaScript
        secure: process.env.NODE_ENV === 'production', // HTTPS apenas em produção
        sameSite: 'strict', // Proteção CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });
      
      // Retornar apenas dados do usuário (sem token)
      res.json({ user: result.user });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      // Limpar cookie de autenticação
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
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
