const axios = require('axios');

async function extractQuestionsFromText(text) {
  // Substitua a URL abaixo pela URL real do seu serviço de IA
  const IA_URL = process.env.IA_EXTRACTION_URL || 'http://localhost:5000/extract-questions';
  try {
    const response = await axios.post(IA_URL, { text });
    // Espera-se que a resposta seja um array de dúvidas/questões extraídas
    return response.data.questions || [];
  } catch (error) {
    // Loga o erro e retorna vazio para fallback
    console.error('Erro ao chamar serviço de IA:', error.message);
    return [];
  }
}

module.exports = { extractQuestionsFromText };
