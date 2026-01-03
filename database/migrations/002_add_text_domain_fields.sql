-- Migração: Adicionar campos de domínio na tabela texts
-- Data: 2026-01-03
-- Descrição: Adicionar colunas objective e foundation_level na tabela texts

-- Adicionar coluna objective (objetivo declarado)
ALTER TABLE texts 
ADD COLUMN IF NOT EXISTS objective VARCHAR(50);

-- Adicionar coluna foundation_level (nível de fundamentação)
ALTER TABLE texts 
ADD COLUMN IF NOT EXISTS foundation_level VARCHAR(50);

-- Adicionar comentários
COMMENT ON COLUMN texts.objective IS 'Objetivo declarado do texto (referência ao code em text_objectives)';
COMMENT ON COLUMN texts.foundation_level IS 'Nível de fundamentação pretendido (referência ao code em foundation_levels)';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_texts_objective ON texts(objective);
CREATE INDEX IF NOT EXISTS idx_texts_foundation_level ON texts(foundation_level);
