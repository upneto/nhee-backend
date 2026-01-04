-- Adicionar campos para relacionar textos-resposta com dúvidas
-- Isso permitirá criar o mapa conceitual mostrando as relações entre textos e dúvidas

-- Adicionar campo para indicar se o texto é uma resposta a uma dúvida
ALTER TABLE texts
ADD COLUMN IF NOT EXISTS in_response_to_question_id UUID REFERENCES questions(id) ON DELETE SET NULL;

-- Adicionar campo para indicar o texto original que gerou a dúvida
ALTER TABLE texts
ADD COLUMN IF NOT EXISTS in_response_to_text_id UUID REFERENCES texts(id) ON DELETE SET NULL;

-- Criar índice para melhor performance nas consultas de mapas conceituais
CREATE INDEX IF NOT EXISTS idx_texts_response_to_question ON texts(in_response_to_question_id);
CREATE INDEX IF NOT EXISTS idx_texts_response_to_text ON texts(in_response_to_text_id);

-- Comentários para documentação
COMMENT ON COLUMN texts.in_response_to_question_id IS 'ID da dúvida/crítica que este texto está respondendo (null se não for resposta)';
COMMENT ON COLUMN texts.in_response_to_text_id IS 'ID do texto original que gerou a dúvida sendo respondida (null se não for resposta)';
