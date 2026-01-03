-- Reinserir dados com encoding UTF-8 correto
SET client_encoding = 'UTF8';

-- Limpar tabelas
TRUNCATE knowledge_areas, text_types, text_objectives, foundation_levels, question_types RESTART IDENTITY CASCADE;

-- Inserir áreas do conhecimento
INSERT INTO knowledge_areas (code, name, description, display_order) VALUES
  ('metafisica', 'Metafísica', E'Estudo dos fundamentos da realidade e da existência', 1),
  ('epistemologia', 'Epistemologia', E'Teoria do conhecimento e da justificação de crenças', 2),
  ('etica', 'Ética', E'Filosofia moral e teoria dos valores', 3),
  ('estetica', 'Estética', E'Filosofia da arte e do belo', 4),
  ('logica', 'Lógica', E'Estudo do raciocínio válido e da inferência', 5),
  ('filosofia-politica', 'Filosofia Política', E'Reflexão sobre poder, justiça e organização social', 6),
  ('filosofia-linguagem', 'Filosofia da Linguagem', E'Análise da natureza e uso da linguagem', 7),
  ('filosofia-ciencia', 'Filosofia da Ciência', E'Fundamentos e métodos do conhecimento científico', 8),
  ('fenomenologia', 'Fenomenologia', E'Estudo das estruturas da experiência e da consciência', 9),
  ('existencialismo', 'Existencialismo', E'Filosofia da existência humana e da liberdade', 10),
  ('outras', 'Outras', E'Outras áreas do conhecimento filosófico', 99);

-- Inserir tipos de texto
INSERT INTO text_types (code, name, description, display_order) VALUES
  ('ensaio', 'Ensaio', E'Texto reflexivo e exploratório sobre um tema', 1),
  ('artigo', 'Artigo', E'Texto estruturado com argumentação acadêmica', 2),
  ('opiniao', 'Opinião', E'Posicionamento pessoal fundamentado sobre um tema', 3),
  ('divulgacao', 'Divulgação', E'Texto para difusão de conhecimento científico', 4);

-- Inserir objetivos
INSERT INTO text_objectives (code, name, description, display_order) VALUES
  ('informar', 'Informar', E'Apresentar informações e dados sobre o tema', 1),
  ('argumentar', 'Argumentar', E'Defender uma tese ou posicionamento', 2),
  ('especular', 'Especular', E'Explorar possibilidades e levantar questões', 3);

-- Inserir níveis de fundamentação
INSERT INTO foundation_levels (code, name, description, display_order) VALUES
  ('exploratorio', 'Exploratório', E'Reflexões iniciais sobre o tema', 1),
  ('fundamentado', 'Fundamentado', E'Argumentação com referências e fundamentação', 2),
  ('rigoroso', 'Rigoroso', E'Análise acadêmica aprofundada e rigorosa', 3);

-- Inserir tipos de contribuição
INSERT INTO question_types (code, name, description, display_order) VALUES
  ('duvida', 'Dúvida Científica', E'Questionamento sobre conceitos ou argumentos', 1),
  ('comentario', 'Comentário Crítico', E'Análise crítica do conteúdo apresentado', 2),
  ('contraponto', 'Contraponto Argumentativo', E'Apresentação de argumento contrário', 3),
  ('complemento', 'Complemento ao Argumento', E'Adição de informações ou perspectivas', 4);
