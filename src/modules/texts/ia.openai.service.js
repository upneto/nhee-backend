
const OpenAI = require('openai');
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

/**
 * Extrai dúvidas de um texto usando o modelo GPT da OpenAI.
 * @param {string} text Texto a ser analisado
 * @param {object} [options] Opções: { prompt, model }
 * @returns {Promise<Array>} Array de dúvidas extraídas
 */
async function extractQuestionsFromText(text, options = {}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada');
  const model = options.model || process.env.OPENAI_GPT_MODEL || 'gpt-4';
  let userPrompt = options.prompt || process.env.OPENAI_EXTRACTION_PROMPT;
  // Remove aspas duplas extras se vierem do .env
  if (userPrompt && userPrompt.startsWith('"') && userPrompt.endsWith('"')) {
    userPrompt = userPrompt.slice(1, -1);
  }
  const defaultPrompt = `Leia o texto abaixo e extraia as principais dúvidas que um leitor pode ter após a leitura. Responda em formato JSON, como um array de objetos com os campos 'title' e 'content'.\nTexto:\n"""\n${text}\n"""\nExemplo de resposta:\n[\n  { "title": "Dúvida 1", "content": "Descrição da dúvida 1" },\n  { "title": "Dúvida 2", "content": "Descrição da dúvida 2" }\n]`;
  const prompt = userPrompt ? userPrompt.replace('{text}', text) : defaultPrompt;

  // LOG: início da chamada IA
  console.log('[IA] Iniciando extração de dúvidas via OpenAI...');
  console.log('[IA] Modelo:', model);
  console.log('[IA] Prompt:', prompt.slice(0, 500) + (prompt.length > 500 ? '... [truncado]' : ''));
  let completion;
  try {
    completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Você é um analista crítico especializado em filosofia e ciência.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });
    // LOG: resposta bruta
    console.log('[IA] Resposta bruta OpenAI:', JSON.stringify(completion, null, 2));
  } catch (err) {
    console.error('[IA] Erro ao chamar OpenAI:', err);
    return [];
  }

  // Tenta extrair JSON da resposta
  const responseText = completion.choices[0].message.content;
  try {
    // O formato esperado é { "duvidas": [ ... ] }
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.duvidas)) {
      console.log('[IA] Dúvidas extraídas:', parsed.duvidas);
      return parsed.duvidas;
    }
    // fallback: se vier array direto
    if (Array.isArray(parsed)) {
      console.log('[IA] Dúvidas extraídas (array direto):', parsed);
      return parsed;
    }
    console.warn('[IA] Resposta da OpenAI não contém dúvidas reconhecíveis.');
    return [];
  } catch (e) {
    console.error('[IA] Erro ao parsear resposta da OpenAI:', e, responseText);
    return [];
  }
}

module.exports = { extractQuestionsFromText };
