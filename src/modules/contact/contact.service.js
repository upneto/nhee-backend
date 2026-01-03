const db = require('../../database/connection');

const contactService = {
  async send(contactData) {
    const { name, email, subject, message } = contactData;
    
    // Salvar no banco
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [name, email, subject, message]
    );
    
    // TODO: Enviar email para administradores
    console.log(`Nova mensagem de contato de ${name} (${email}): ${subject}`);
  }
};

module.exports = contactService;
