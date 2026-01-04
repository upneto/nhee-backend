-- Migration 005: Adicionar campos de autenticidade aos textos

-- Adicionar campos de autenticidade ao texto
ALTER TABLE texts ADD COLUMN IF NOT EXISTS is_author BOOLEAN DEFAULT false;
ALTER TABLE texts ADD COLUMN IF NOT EXISTS has_institutional_link BOOLEAN DEFAULT false;
ALTER TABLE texts ADD COLUMN IF NOT EXISTS institution_name VARCHAR(255);
ALTER TABLE texts ADD COLUMN IF NOT EXISTS has_verifiable_claims BOOLEAN DEFAULT false;
ALTER TABLE texts ADD COLUMN IF NOT EXISTS sources TEXT[]; -- Array de fontes/referências

-- Comentários para documentação
COMMENT ON COLUMN texts.is_author IS 'Indica se o usuário que cadastrou é o autor do texto';
COMMENT ON COLUMN texts.has_institutional_link IS 'Indica se o autor tem vínculo institucional';
COMMENT ON COLUMN texts.institution_name IS 'Nome da instituição vinculada ao autor';
COMMENT ON COLUMN texts.has_verifiable_claims IS 'Indica se o texto possui afirmações verificáveis';
COMMENT ON COLUMN texts.sources IS 'Array de fontes e referências verificáveis';
