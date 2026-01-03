const domainsService = require('../../modules/domains/domains.service');

const domainValidator = {
  /**
   * Valida se um valor de domínio existe e está ativo
   * @param {string} table - Nome da tabela de domínio
   * @param {string} value - Valor a ser validado
   * @param {string} fieldName - Nome do campo para mensagem de erro
   * @param {boolean} required - Se o campo é obrigatório
   */
  async validate(table, value, fieldName, required = false) {
    // Se não é obrigatório e está vazio, retorna válido
    if (!required && (!value || value === '')) {
      return { valid: true };
    }

    // Se é obrigatório e está vazio, retorna inválido
    if (required && (!value || value === '')) {
      return {
        valid: false,
        error: `${fieldName} é obrigatório`
      };
    }

    // Valida se o valor existe na tabela de domínio
    const exists = await domainsService.validateDomainValue(table, value);
    
    if (!exists) {
      return {
        valid: false,
        error: `${fieldName} inválido: '${value}' não existe ou está inativo`
      };
    }

    return { valid: true };
  },

  /**
   * Valida múltiplos campos de domínio
   * @param {Array} validations - Array de objetos {table, value, fieldName, required}
   */
  async validateMultiple(validations) {
    const errors = [];

    for (const validation of validations) {
      const result = await this.validate(
        validation.table,
        validation.value,
        validation.fieldName,
        validation.required
      );

      if (!result.valid) {
        errors.push(result.error);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

module.exports = domainValidator;
