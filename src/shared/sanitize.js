/**
 * Utilitário para sanitização de dados de entrada
 * Previne XSS e injeção de código malicioso
 */

/**
 * Remove tags HTML potencialmente perigosas do texto
 * Permite apenas formatação básica segura
 */
function sanitizeHtml(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Lista de tags perigosas a remover
  const dangerousTags = [
    'script', 'iframe', 'object', 'embed', 'link', 'style',
    'meta', 'base', 'form', 'input', 'button', 'textarea'
  ];
  
  let sanitized = text;
  
  // Remover tags perigosas
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis');
    sanitized = sanitized.replace(regex, '');
    // Remover tags auto-fechadas
    const selfClosing = new RegExp(`<${tag}[^>]*/>`, 'gi');
    sanitized = sanitized.replace(selfClosing, '');
  });
  
  // Remover atributos de eventos (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remover javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remover data: URLs (podem conter scripts)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  return sanitized;
}

/**
 * Sanitiza um objeto recursivamente
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        sanitized[key] = sanitizeHtml(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Valida comprimento de string
 */
function validateLength(text, minLength = 0, maxLength = 10000) {
  if (!text) return false;
  const length = text.length;
  return length >= minLength && length <= maxLength;
}

/**
 * Valida se o texto contém apenas caracteres permitidos
 */
function validateCharacters(text) {
  if (!text) return true;
  
  // Permite letras, números, espaços, pontuação comum e acentuação
  // Bloqueia caracteres de controle perigosos
  const dangerousChars = /[\x00-\x08\x0B\x0C\x0E-\x1F]/;
  return !dangerousChars.test(text);
}

module.exports = {
  sanitizeHtml,
  sanitizeObject,
  validateLength,
  validateCharacters
};
