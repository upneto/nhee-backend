-- Migração: Adicionar Tabelas de Domínio
-- Data: 2026-01-03
-- Descrição: Criar tabelas para armazenar valores de domínio que estavam hardcoded no frontend

-- ============================================================================
-- 1. ÁREAS DO CONHECIMENTO
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir áreas do conhecimento padrão
INSERT INTO knowledge_areas (code, name, description, display_order) VALUES
  ('metafisica', 'Metafísica', 'Estudo dos fundamentos da realidade e da existência', 1),
  ('epistemologia', 'Epistemologia', 'Teoria do conhecimento e da justificação de crenças', 2),
  ('etica', 'Ética', 'Filosofia moral e teoria dos valores', 3),
  ('estetica', 'Estética', 'Filosofia da arte e do belo', 4),
  ('logica', 'Lógica', 'Estudo do raciocínio válido e da inferência', 5),
  ('filosofia-politica', 'Filosofia Política', 'Reflexão sobre poder, justiça e organização social', 6),
  ('filosofia-linguagem', 'Filosofia da Linguagem', 'Análise da natureza e uso da linguagem', 7),
  ('filosofia-ciencia', 'Filosofia da Ciência', 'Fundamentos e métodos do conhecimento científico', 8),
  ('fenomenologia', 'Fenomenologia', 'Estudo das estruturas da experiência e da consciência', 9),
  ('existencialismo', 'Existencialismo', 'Filosofia da existência humana e da liberdade', 10),
  ('outras', 'Outras', 'Outras áreas do conhecimento filosófico', 99);

-- ============================================================================
-- 2. TIPOS DE TEXTO
-- ============================================================================
CREATE TABLE IF NOT EXISTS text_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir tipos de texto padrão
INSERT INTO text_types (code, name, description, display_order) VALUES
  ('ensaio', 'Ensaio', 'Texto reflexivo e exploratório sobre um tema', 1),
  ('artigo', 'Artigo', 'Texto estruturado com argumentação acadêmica', 2),
  ('opiniao', 'Opinião', 'Posicionamento pessoal fundamentado sobre um tema', 3),
  ('divulgacao', 'Divulgação', 'Texto para difusão de conhecimento científico', 4);

-- ============================================================================
-- 3. OBJETIVOS DECLARADOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS text_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir objetivos padrão
INSERT INTO text_objectives (code, name, description, display_order) VALUES
  ('informar', 'Informar', 'Apresentar informações e dados sobre o tema', 1),
  ('argumentar', 'Argumentar', 'Defender uma tese ou posicionamento', 2),
  ('especular', 'Especular', 'Explorar possibilidades e levantar questões', 3);

-- ============================================================================
-- 4. NÍVEIS DE FUNDAMENTAÇÃO
-- ============================================================================
CREATE TABLE IF NOT EXISTS foundation_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir níveis de fundamentação padrão
INSERT INTO foundation_levels (code, name, description, display_order) VALUES
  ('exploratorio', 'Exploratório', 'Reflexões iniciais sobre o tema', 1),
  ('fundamentado', 'Fundamentado', 'Argumentação com referências e fundamentação', 2),
  ('rigoroso', 'Rigoroso', 'Análise acadêmica aprofundada e rigorosa', 3);

-- ============================================================================
-- 5. TIPOS DE CONTRIBUIÇÃO/DÚVIDA
-- ============================================================================
CREATE TABLE IF NOT EXISTS question_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir tipos de contribuição padrão
INSERT INTO question_types (code, name, description, display_order) VALUES
  ('duvida', 'Dúvida Científica', 'Questionamento sobre conceitos ou argumentos', 1),
  ('comentario', 'Comentário Crítico', 'Análise crítica do conteúdo apresentado', 2),
  ('contraponto', 'Contraponto Argumentativo', 'Apresentação de argumento contrário', 3),
  ('complemento', 'Complemento ao Argumento', 'Adição de informações ou perspectivas', 4);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_knowledge_areas_code ON knowledge_areas(code);
CREATE INDEX IF NOT EXISTS idx_knowledge_areas_active ON knowledge_areas(is_active);
CREATE INDEX IF NOT EXISTS idx_text_types_code ON text_types(code);
CREATE INDEX IF NOT EXISTS idx_text_types_active ON text_types(is_active);
CREATE INDEX IF NOT EXISTS idx_text_objectives_code ON text_objectives(code);
CREATE INDEX IF NOT EXISTS idx_text_objectives_active ON text_objectives(is_active);
CREATE INDEX IF NOT EXISTS idx_foundation_levels_code ON foundation_levels(code);
CREATE INDEX IF NOT EXISTS idx_foundation_levels_active ON foundation_levels(is_active);
CREATE INDEX IF NOT EXISTS idx_question_types_code ON question_types(code);
CREATE INDEX IF NOT EXISTS idx_question_types_active ON question_types(is_active);

-- ============================================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
-- ============================================================================
CREATE TRIGGER update_knowledge_areas_updated_at BEFORE UPDATE ON knowledge_areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_types_updated_at BEFORE UPDATE ON text_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_objectives_updated_at BEFORE UPDATE ON text_objectives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foundation_levels_updated_at BEFORE UPDATE ON foundation_levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_types_updated_at BEFORE UPDATE ON question_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS DAS TABELAS
-- ============================================================================
COMMENT ON TABLE knowledge_areas IS 'Áreas do conhecimento filosófico para categorização de textos';
COMMENT ON TABLE text_types IS 'Tipos de texto científico/acadêmico';
COMMENT ON TABLE text_objectives IS 'Objetivos declarados dos textos';
COMMENT ON TABLE foundation_levels IS 'Níveis de fundamentação pretendidos';
COMMENT ON TABLE question_types IS 'Tipos de contribuições e dúvidas sobre textos';

COMMENT ON COLUMN knowledge_areas.code IS 'Código único para uso em APIs (slug)';
COMMENT ON COLUMN knowledge_areas.is_active IS 'Indica se a área está ativa para seleção';
COMMENT ON COLUMN knowledge_areas.display_order IS 'Ordem de exibição nas listas';
