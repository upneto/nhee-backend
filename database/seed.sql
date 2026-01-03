-- Seed data para testes
-- Senha padrão para todos os usuários: senha123 (hash bcrypt)

-- Limpar dados existentes (cuidado em produção!)
TRUNCATE TABLE authenticity_ratings, questions, text_concepts, texts, concepts, users CASCADE;

-- Inserir usuários de teste
INSERT INTO users (id, username, email, password, name, institution, bio) VALUES
('11111111-1111-1111-1111-111111111111', 'filosofante123', 'filosofante@email.com', '$2b$10$rX8X8X8X8X8X8X8X8X8X8uj7bQZK6qLZj5mH5mH5mH5mH5mH5mH5m', 'João Filosofante', 'USP', 'Pesquisador em metafísica e fenomenologia'),
('22222222-2222-2222-2222-222222222222', 'etica_contemporanea', 'etica@email.com', '$2b$10$rX8X8X8X8X8X8X8X8X8X8uj7bQZK6qLZj5mH5mH5mH5mH5mH5mH5m', 'Maria Ética', 'UNICAMP', 'Especialista em ética aplicada'),
('33333333-3333-3333-3333-333333333333', 'epistemologia_br', 'epistemo@email.com', '$2b$10$rX8X8X8X8X8X8X8X8X8X8uj7bQZK6qLZj5mH5mH5mH5mH5mH5mH5m', 'Carlos Epistêmico', 'UFRJ', 'Doutor em teoria do conhecimento'),
('44444444-4444-4444-4444-444444444444', 'logica_formal', 'logica@email.com', '$2b$10$rX8X8X8X8X8X8X8X8X8X8uj7bQZK6qLZj5mH5mH5mH5mH5mH5mH5m', 'Ana Lógica', 'UFMG', 'Professora de lógica e filosofia da matemática'),
('55555555-5555-5555-5555-555555555555', 'estetica_arte', 'estetica@email.com', '$2b$10$rX8X8X8X8X8X8X8X8X8X8uj7bQZK6qLZj5mH5mH5mH5mH5mH5mH5m', 'Pedro Esteta', 'UNESP', 'Pesquisador em estética e filosofia da arte');

-- Inserir textos de teste
INSERT INTO texts (id, user_id, title, content, area, type, author, institution, "references", objective, foundation_level, created_at) VALUES
-- Textos com muitas dúvidas e alta autenticidade
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Sobre a Natureza do Tempo', 
'O tempo não é uma entidade externa que flui independentemente de nossa experiência. Ele emerge da relação entre consciência e mudança, sendo inseparável da percepção que temos dos eventos. Quando analisamos fenômenos temporais, não estamos lidando com uma dimensão objetiva e absoluta, mas com uma construção experiencial que varia conforme o observador e seu estado de consciência.

A física moderna, especialmente a teoria da relatividade, já nos mostrou que o tempo não é uniforme e absoluto. Ele se dilata ou contrai dependendo da velocidade e da gravidade. Mas isso é apenas o aspecto físico. Do ponto de vista fenomenológico, o tempo é ainda mais complexo: é vivenciado, sentido, e sua passagem depende da intensidade de nossa atenção e engajamento com o presente.

Husserl, em suas meditações sobre a consciência interna do tempo, demonstrou que a experiência temporal envolve três dimensões: retenção (o que acabou de passar), impressão (o agora), e protensão (a antecipação do que virá). Essa estrutura triádica não é apenas uma descrição psicológica, mas a condição de possibilidade de qualquer experiência temporal.', 
'metafisica', 'ensaio', 'João Filosofante', 'USP', 'HUSSERL, Edmund. A Ideia da Fenomenologia. Lisboa: Edições 70, 1990.;EINSTEIN, Albert. Sobre a Teoria da Relatividade Especial e Geral. Rio de Janeiro: Contraponto, 1999.', 'especular', 'fundamentado', NOW() - INTERVAL '5 days'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Conhecimento e Crença: Uma Distinção Necessária?',
'A fronteira entre conhecimento e crença tem sido debatida desde Platão. Mas será que essa distinção ainda faz sentido em um contexto onde a justificação epistêmica é cada vez mais problemática? A definição tradicional de conhecimento como crença verdadeira justificada foi desafiada por Gettier em 1963, e desde então múltiplas teorias tentaram dar conta do problema.

O que significa justificar uma crença? Depende de evidências empíricas? De coerência lógica? De confiabilidade dos processos cognitivos? Cada resposta leva a uma teoria diferente: fundacionalismo, coerentismo, confiabilismo. E cada uma enfrenta seus próprios problemas.

Talvez a questão fundamental não seja como definir conhecimento, mas entender por que essa distinção importa para nós. Quando dizemos "eu sei" ao invés de "eu acredito", estamos fazendo uma reivindicação social, assumindo uma responsabilidade epistêmica. Estamos dizendo que nossa crença atende a certos padrões que a comunidade reconhece como adequados.',
'epistemologia', 'artigo', 'Carlos Epistêmico', 'UFRJ', 'GETTIER, Edmund. Is Justified True Belief Knowledge? Analysis, 1963.;WILLIAMSON, Timothy. Knowledge and its Limits. Oxford University Press, 2000.', 'argumentar', 'rigoroso', NOW() - INTERVAL '3 days'),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'A Responsabilidade Moral em Tempos de Incerteza',
'Em uma era de informação fragmentada e múltiplas verdades concorrentes, como podemos fundamentar nossas escolhas morais? A responsabilidade ética não pode mais se apoiar em sistemas normativos absolutos ou em princípios universais inquestionáveis. Vivemos em um contexto de pluralismo moral radical.

Isso não significa, contudo, que devemos abraçar o relativismo ético. Há uma diferença crucial entre reconhecer a diversidade de perspectivas morais e afirmar que todas são igualmente válidas. A responsabilidade moral, hoje, exige um esforço constante de reflexão crítica, diálogo e abertura ao outro.

A ética do cuidado, desenvolvida por pensadoras feministas como Carol Gilligan e Nel Noddings, oferece uma alternativa interessante às éticas do dever e da consequência. Ela enfatiza as relações concretas, o contexto situado, e a atenção às particularidades de cada situação moral. Não se trata de aplicar regras abstratas, mas de cultivar uma sensibilidade moral que responde às demandas específicas de cada encontro ético.',
'etica', 'ensaio', 'Maria Ética', 'UNICAMP', 'GILLIGAN, Carol. In a Different Voice. Harvard University Press, 1982.;NODDINGS, Nel. Caring: A Feminine Approach to Ethics. University of California Press, 1984.', 'argumentar', 'fundamentado', NOW() - INTERVAL '7 days'),

-- Mais textos para diversidade
('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'Paradoxos da Autorreferência em Lógica',
'A lógica formal, desde os gregos, se depara com paradoxos que desafiam sua consistência. O paradoxo do mentiroso - "esta frase é falsa" - é apenas o mais conhecido de uma família de paradoxos autorreferenciais. Russell descobriu um paradoxo similar na teoria dos conjuntos: o conjunto de todos os conjuntos que não contêm a si mesmos contém a si mesmo? Se sim, não; se não, sim.

Esses paradoxos não são meras curiosidades intelectuais. Eles revelam limitações fundamentais em nossos sistemas formais. O teorema da incompletude de Gödel mostrou que qualquer sistema formal suficientemente rico para expressar a aritmética básica é necessariamente incompleto: haverá verdades aritméticas que não podem ser provadas dentro do sistema.

A solução não está em eliminar a autorreferência, mas em compreender suas condições de possibilidade e suas limitações. Tarski, por exemplo, mostrou que a verdade de uma linguagem não pode ser definida dentro dessa mesma linguagem, mas requer uma metalinguagem. Essa hierarquia de linguagens oferece um caminho para lidar com a autorreferência de forma controlada.',
'logica', 'artigo', 'Ana Lógica', 'UFMG', 'RUSSELL, Bertrand. Mathematical Logic as Based on the Theory of Types. 1908.;GÖDEL, Kurt. On Formally Undecidable Propositions. 1931.;TARSKI, Alfred. The Concept of Truth in Formalized Languages. 1933.', 'informar', 'rigoroso', NOW() - INTERVAL '10 days'),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'A Experiência Estética e o Sublime',
'O que distingue a experiência estética de outras formas de experiência? Kant argumentava que o juízo estético é desinteressado - não buscamos satisfazer um desejo ou alcançar um objetivo prático, mas simplesmente contemplamos o objeto em sua forma. Mas essa contemplação desinteressada é realmente possível? Ou sempre trazemos nossas categorias, nossos interesses, nossa história para o encontro com a obra de arte?

O sublime, para Kant, é uma experiência estética particular: confrontamos algo tão vasto, tão poderoso que nossa imaginação não consegue apreendê-lo. Uma tempestade no oceano, um céu estrelado infinito, uma montanha imensa. Há um prazer peculiar nessa experiência de inadequação, porque ela revela nossa capacidade racional de pensar o infinito, mesmo quando não podemos imaginá-lo.

A arte contemporânea frequentemente busca provocar esse tipo de experiência. Instalações que nos desorientam espacialmente, obras que desafiam nossas expectativas, performances que nos confrontam com limites. A experiência estética não é mais apenas contemplação serena, mas também perturbação, questionamento, transformação.',
'estetica', 'ensaio', 'Pedro Esteta', 'UNESP', 'KANT, Immanuel. Crítica da Faculdade do Juízo. Forense Universitária, 1993.;LYOTARD, Jean-François. O Inumano. Estampa, 1990.', 'especular', 'fundamentado', NOW() - INTERVAL '2 days'),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Consciência e Intencionalidade',
'A consciência é sempre consciência de algo. Essa é a tese central da fenomenologia husserliana: a intencionalidade é a característica definidora da vida mental. Não existe consciência vazia, pura, sem objeto. Mesmo quando imaginamos ou sonhamos, nossa consciência está direcionada a objetos imaginários ou oníricos.

Essa estrutura intencional levanta questões profundas sobre a relação entre mente e mundo. Como a consciência pode se dirigir a objetos que não existem? Quando penso em um unicórnio, minha consciência está dirigida a algo, mas unicórnios não existem. Brentano, predecessor de Husserl, argumentava que objetos intencionais têm uma existência mental peculiar.

Mas Husserl foi além. Ele mostrou que a intencionalidade não é apenas uma relação entre consciência e objeto, mas uma estrutura complexa envolvendo noese (ato de consciência) e noema (objeto tal como visado). O mesmo objeto pode ser visado de múltiplas formas - posso ver uma árvore, imaginar uma árvore, recordar uma árvore. Em cada caso, a árvore-como-percebida é diferente, embora seja a mesma árvore.',
'metafisica', 'artigo', 'João Filosofante', 'USP', 'HUSSERL, Edmund. Investigações Lógicas. Forense Universitária, 2012.;BRENTANO, Franz. Psicologia desde un punto de vista empírico. 1874.', 'informar', 'rigoroso', NOW() - INTERVAL '1 day'),

('11111111-1111-1111-1111-111111111117', '22222222-2222-2222-2222-222222222222', 'Ética das Virtudes em Aristóteles',
'A ética aristotélica centra-se no conceito de virtude como meio-termo. A eudaimonia, traduzida como felicidade ou florescimento humano, é o fim último da vida humana. Mas ao contrário do hedonismo, que identifica felicidade com prazer, Aristóteles argumenta que a verdadeira felicidade consiste na atividade da alma conforme à virtude.

As virtudes não são regras ou princípios, mas disposições de caráter adquiridas através da prática. Tornamo-nos justos praticando atos justos, corajosos praticando atos corajosos. A virtude é um hábito cultivado, uma segunda natureza que se desenvolve através da educação moral e da experiência.

O meio-termo não é uma média aritmética, mas um equilíbrio situado que depende das circunstâncias. A coragem, por exemplo, é o meio-termo entre a covardia e a temeridade. Mas o que conta como corajoso varia conforme a situação e a pessoa. A virtude exige prudência (phronesis) - a sabedoria prática de reconhecer o que é apropriado em cada contexto.',
'etica', 'divulgacao', 'Maria Ética', 'UNICAMP', 'ARISTÓTELES. Ética a Nicômaco. São Paulo: Editora 34, 2009.', 'informar', 'fundamentado', NOW() - INTERVAL '12 days'),

('11111111-1111-1111-1111-111111111118', '33333333-3333-3333-3333-333333333333', 'O Problema da Indução em Hume',
'David Hume identificou um problema fundamental no raciocínio indutivo: não há justificação racional para a crença de que o futuro se parecerá com o passado. Observamos que o sol nasceu todos os dias até agora, e inferimos que nascerá amanhã. Mas essa inferência não é logicamente necessária. É perfeitamente concebível que o sol não nasça amanhã.

A resposta tradicional é que a indução se justifica por seu sucesso passado: a indução funcionou no passado, logo funcionará no futuro. Mas Hume aponta que esse argumento é circular - ele usa indução para justificar indução. Estamos presos em um círculo vicioso.

Kant tentou resolver o problema distinguindo entre conhecimento a priori e a posteriori. Ele argumentou que certos princípios, como a causalidade, são condições de possibilidade da experiência, não derivados dela. Mas isso realmente resolve o problema de Hume? Ou apenas o desloca para questões sobre como conhecemos esses princípios a priori?',
'epistemologia', 'ensaio', 'Carlos Epistêmico', 'UFRJ', 'HUME, David. Investigação sobre o Entendimento Humano. UNESP, 1999.;KANT, Immanuel. Crítica da Razão Pura. Fundação Calouste Gulbenkian, 2001.', 'especular', 'rigoroso', NOW() - INTERVAL '8 days'),

('11111111-1111-1111-1111-111111111119', '44444444-4444-4444-4444-444444444444', 'Teorema da Incompletude de Gödel',
'Em 1931, Kurt Gödel provou um dos resultados mais surpreendentes da história da lógica: qualquer sistema formal consistente e suficientemente rico para expressar a aritmética contém proposições verdadeiras que não podem ser provadas dentro do sistema. Esse resultado destruiu o programa de Hilbert de fundamentar toda a matemática em um sistema formal completo e consistente.

A prova de Gödel é engenhosa: ele constrói uma proposição que diz, essencialmente, "esta proposição não é provável". Se ela fosse provável, seria falsa (contradição). Logo, não é provável. Mas se não é provável, então é verdadeira (pois é exatamente isso que ela afirma). Temos assim uma proposição verdadeira mas não provável.

As implicações filosóficas são profundas. O teorema sugere que a verdade matemática transcende a provabilidade formal. Há verdades matemáticas que nunca poderemos provar, não por limitações práticas, mas por limitações lógicas fundamentais. Isso levanta questões sobre a natureza da matemática: é descoberta ou inventada? Platônica ou construtivista?',
'logica', 'artigo', 'Ana Lógica', 'UFMG', 'GÖDEL, Kurt. On Formally Undecidable Propositions. 1931.;NAGEL, Ernest; NEWMAN, James. Gödel''s Proof. NYU Press, 2001.', 'informar', 'rigoroso', NOW() - INTERVAL '4 days'),

('11111111-1111-1111-1111-11111111111a', '55555555-5555-5555-5555-555555555555', 'Arte Contemporânea e Significado',
'O que faz de algo uma obra de arte? Essa pergunta se tornou ainda mais urgente com a arte contemporânea. Duchamp apresentou um urinol como escultura. Warhol serigrafiou latas de sopa. Cage compôs uma peça de silêncio. Esses gestos desafiam nossas concepções tradicionais de arte baseadas em beleza, habilidade técnica ou representação.

Arthur Danto argumenta que o que define uma obra de arte não são propriedades perceptuais, mas seu lugar no mundo da arte - o contexto institucional, histórico e teórico que a constitui como arte. A mesma lata de sopa que é mercadoria no supermercado se torna arte quando Warhol a coloca em uma galeria, cercada por teorias e práticas artísticas.

Mas isso não torna a arte arbitrária? Se qualquer coisa pode ser arte dependendo do contexto, não perdemos critérios de valor? Talvez. Ou talvez a arte contemporânea nos convida a pensar o valor artístico de forma diferente - não em termos de beleza atemporal, mas de provocação conceitual, questionamento de convenções, abertura de novas possibilidades de significado.',
'estetica', 'opiniao', 'Pedro Esteta', 'UNESP', 'DANTO, Arthur. A Transfiguração do Lugar-Comum. Cosac Naify, 2005.;DICKIE, George. Art and the Aesthetic: An Institutional Analysis. Cornell University Press, 1974.', 'especular', 'fundamentado', NOW() - INTERVAL '6 days');

-- Inserir questões/dúvidas
INSERT INTO questions (id, text_id, user_id, title, content, type, created_at) VALUES
-- Para o texto sobre Tempo
('22222222-2222-2222-2222-222222222221', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Tempo objetivo vs subjetivo', 'Como reconciliar a visão fenomenológica do tempo como construção experiencial com a realidade física do tempo medido por relógios atômicos?', 'duvida', NOW() - INTERVAL '4 days'),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Husserl e física moderna', 'Há realmente compatibilidade entre a fenomenologia husserliana e a física relativística? Ou são discursos incomensuráveis?', 'duvida', NOW() - INTERVAL '4 days'),
('22222222-2222-2222-2222-222222222223', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Retenção e memória', 'A retenção husserliana é diferente da memória? Como exatamente funciona essa distinção?', 'duvida', NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222224', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Experiência temporal na arte', 'Como essa análise fenomenológica do tempo se aplica à experiência de obras de arte temporais, como música ou cinema?', 'comentario', NOW() - INTERVAL '3 days'),

-- Para o texto sobre Conhecimento e Crença
('22222222-2222-2222-2222-222222222225', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Gettier e virtude epistemológica', 'A epistemologia das virtudes resolve os casos de Gettier? Ou apenas desloca o problema?', 'duvida', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222226', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Responsabilidade epistêmica', 'Excelente ponto sobre responsabilidade epistêmica. Mas como isso se aplica em contextos de desinformação massiva?', 'comentario', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222227', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Fundacionalismo revisitado', 'O fundacionalismo modesto de Susan Haack não oferece uma via intermediária interessante?', 'sugestao', NOW() - INTERVAL '1 day'),

-- Para o texto sobre Responsabilidade Moral
('22222222-2222-2222-2222-222222222228', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Ética do cuidado e justiça', 'A ética do cuidado não corre o risco de negligenciar questões de justiça estrutural?', 'critica', NOW() - INTERVAL '6 days'),
('22222222-2222-2222-2222-222222222229', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Pluralismo e relativismo', 'Onde exatamente você traça a linha entre pluralismo moral e relativismo ético?', 'duvida', NOW() - INTERVAL '5 days'),

-- Mais questões para diversos textos
('22222222-2222-2222-2222-22222222222a', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Hierarquia de linguagens', 'A solução de Tarski realmente resolve o paradoxo ou apenas o empurra para outro nível?', 'duvida', NOW() - INTERVAL '9 days'),
('22222222-2222-2222-2222-22222222222b', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Sublime kantiano hoje', 'Como pensar o sublime em uma era de saturação de imagens? Ainda é possível essa experiência?', 'duvida', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-22222222222c', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'Intencionalidade e IA', 'Como a teoria da intencionalidade se aplica (ou não) a sistemas de IA?', 'comentario', NOW() - INTERVAL '12 hours'),
('22222222-2222-2222-2222-22222222222d', '11111111-1111-1111-1111-111111111117', '33333333-3333-3333-3333-333333333333', 'Virtudes aristotélicas e neurociência', 'Pesquisas em neurociência sobre hábitos confirmam ou desafiam a teoria aristotélica das virtudes?', 'sugestao', NOW() - INTERVAL '11 days'),
('22222222-2222-2222-2222-22222222222e', '11111111-1111-1111-1111-111111111118', '55555555-5555-5555-5555-555555555555', 'Indução e aprendizado de máquina', 'O problema da indução se aplica aos algoritmos de ML? Como eles "justificam" suas previsões?', 'comentario', NOW() - INTERVAL '7 days');

-- Inserir avaliações de autenticidade
INSERT INTO authenticity_ratings (text_id, user_id, rating) VALUES
-- Texto sobre Tempo (alta autenticidade média: ~8.5)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 9),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 8),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 9),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 8),

-- Texto sobre Conhecimento (alta autenticidade: ~9.1)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 10),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 9),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 9),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 9),

-- Texto sobre Responsabilidade Moral (autenticidade média: ~7.2)
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 7),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 8),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 7),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 7),

-- Outros textos
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 8),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 9),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 8),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 7),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 8),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 7),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 9),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 9),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 10),

('11111111-1111-1111-1111-111111111117', '11111111-1111-1111-1111-111111111111', 8),
('11111111-1111-1111-1111-111111111117', '33333333-3333-3333-3333-333333333333', 8),
('11111111-1111-1111-1111-111111111117', '44444444-4444-4444-4444-444444444444', 7),

('11111111-1111-1111-1111-111111111118', '11111111-1111-1111-1111-111111111111', 9),
('11111111-1111-1111-1111-111111111118', '22222222-2222-2222-2222-222222222222', 9),
('11111111-1111-1111-1111-111111111118', '44444444-4444-4444-4444-444444444444', 10),

('11111111-1111-1111-1111-111111111119', '11111111-1111-1111-1111-111111111111', 10),
('11111111-1111-1111-1111-111111111119', '22222222-2222-2222-2222-222222222222', 9),
('11111111-1111-1111-1111-111111111119', '33333333-3333-3333-3333-333333333333', 9),

('11111111-1111-1111-1111-11111111111a', '11111111-1111-1111-1111-111111111111', 7),
('11111111-1111-1111-1111-11111111111a', '22222222-2222-2222-2222-222222222222', 8),
('11111111-1111-1111-1111-11111111111a', '33333333-3333-3333-3333-333333333333', 7);

-- Mensagem de conclusão
SELECT 'Seed data inserido com sucesso!' as status,
       (SELECT COUNT(*) FROM users) as usuarios,
       (SELECT COUNT(*) FROM texts) as textos,
       (SELECT COUNT(*) FROM questions) as questoes,
       (SELECT COUNT(*) FROM authenticity_ratings) as avaliacoes;
