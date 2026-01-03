const contactService = require('./contact.service');

const contactController = {
  async send(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;
      
      await contactService.send({ name, email, subject, message });
      
      res.json({ message: 'Mensagem enviada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = contactController;
