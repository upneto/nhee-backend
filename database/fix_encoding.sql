-- Corrigir encoding UTF-8 para português
SET client_encoding = 'UTF8';

-- Atualizar conceitos
UPDATE concepts SET name = 'Consciência' WHERE id = 'c0000002-0000-0000-0000-000000000002';
UPDATE concepts SET description = 'Estado de percepção e autoconsciência' WHERE id = 'c0000002-0000-0000-0000-000000000002';

UPDATE concepts SET name = 'Crença' WHERE id = 'c0000006-0000-0000-0000-000000000006';

UPDATE concepts SET name = 'Justificação' WHERE id = 'c0000007-0000-0000-0000-000000000007';
UPDATE concepts SET description = 'Fundamentação racional de crenças' WHERE id = 'c0000007-0000-0000-0000-000000000007';

UPDATE concepts SET name = 'Ética do Cuidado' WHERE id = 'c0000010-0000-0000-0000-000000000010';
UPDATE concepts SET description = 'Abordagem ética baseada em relações e contexto' WHERE id = 'c0000010-0000-0000-0000-000000000010';

UPDATE concepts SET name = 'Autorreferência' WHERE id = 'c0000014-0000-0000-0000-000000000014';

UPDATE concepts SET name = 'Representação' WHERE id = 'c0000018-0000-0000-0000-000000000018';

UPDATE concepts SET name = 'Indução' WHERE id = 'c0000021-0000-0000-0000-000000000021';

UPDATE concepts SET name = 'Experiência' WHERE id = 'c0000022-0000-0000-0000-000000000022';
UPDATE concepts SET description = 'Vivência consciente e perceptiva' WHERE id = 'c0000022-0000-0000-0000-000000000022';

-- Atualizar usuários
UPDATE users SET name = 'João Filosofante' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE users SET bio = 'Pesquisador em metafísica e fenomenologia' WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE users SET name = 'Maria Ética' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE users SET bio = 'Especialista em ética aplicada' WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE users SET name = 'Carlos Epistêmico' WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE users SET name = 'Ana Lógica' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE users SET bio = 'Professora de lógica e filosofia da matemática' WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE users SET bio = 'Pesquisador em estética e filosofia da arte' WHERE id = '55555555-5555-5555-5555-555555555555';

-- Atualizar textos - apenas os campos críticos
UPDATE texts SET 
  author = 'João Filosofante',
  content = 'O tempo não é uma entidade externa que flui independentemente de nossa experiência. Ele emerge da relação entre consciência e mudança, sendo inseparável da percepção que temos dos eventos. Quando analisamos fenômenos temporais, não estamos lidando com uma dimensão objetiva e absoluta, mas com uma construção experiencial que varia conforme o observador e seu estado de consciência.

A física moderna, especialmente a teoria da relatividade, já nos mostrou que o tempo não é uniforme e absoluto. Ele se dilata ou contrai dependendo da velocidade e da gravidade. Mas isso é apenas o aspecto físico. Do ponto de vista fenomenológico, o tempo é ainda mais complexo: é vivenciado, sentido, e sua passagem depende da intensidade de nossa atenção e engajamento com o presente.

Husserl, em suas meditações sobre a consciência interna do tempo, demonstrou que a experiência temporal envolve três dimensões: retenção (o que acabou de passar), impressão (o agora), e protensão (a antecipação do que virá). Essa estrutura triádica não é apenas uma descrição psicológica, mas a condição de possibilidade de qualquer experiência temporal.',
  "references" = 'HUSSERL, Edmund. A Ideia da Fenomenologia. Lisboa: Edições 70, 1990.;EINSTEIN, Albert. Sobre a Teoria da Relatividade Especial e Geral. Rio de Janeiro: Contraponto, 1999.'
WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

UPDATE texts SET 
  author = 'Carlos Epistêmico',
  content = 'A fronteira entre conhecimento e crença tem sido debatida desde Platão. Mas será que essa distinção ainda faz sentido em um contexto onde a justificação epistêmica é cada vez mais problemática? A definição tradicional de conhecimento como crença verdadeira justificada foi desafiada por Gettier em 1963, e desde então múltiplas teorias tentaram dar conta do problema.

O que significa justificar uma crença? Depende de evidências empíricas? De coerência lógica? De confiabilidade dos processos cognitivos? Cada resposta leva a uma teoria diferente: fundacionalismo, coerentismo, confiabilismo. E cada uma enfrenta seus próprios problemas.

Talvez a questão fundamental não seja como definir conhecimento, mas entender por que essa distinção importa para nós. Quando dizemos "eu sei" ao invés de "eu acredito", estamos fazendo uma reivindicação social, assumindo uma responsabilidade epistêmica. Estamos dizendo que nossa crença atende a certos padrões que a comunidade reconhece como adequados.'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

UPDATE texts SET 
  author = 'Maria Ética',
  content = 'Em uma era de informação fragmentada e múltiplas verdades concorrentes, como podemos fundamentar nossas escolhas morais? A responsabilidade ética não pode mais se apoiar em sistemas normativos absolutos ou em princípios universais inquestionáveis. Vivemos em um contexto de pluralismo moral radical.

Isso não significa, contudo, que devemos abraçar o relativismo ético. Há uma diferença crucial entre reconhecer a diversidade de perspectivas morais e afirmar que todas são igualmente válidas. A responsabilidade moral, hoje, exige um esforço constante de reflexão crítica, diálogo e abertura ao outro.

A ética do cuidado, desenvolvida por pensadoras feministas como Carol Gilligan e Nel Noddings, oferece uma alternativa interessante às éticas do dever e da consequência. Ela enfatiza as relações concretas, o contexto situado, e a atenção às particularidades de cada situação moral. Não se trata de aplicar regras abstratas, mas de cultivar uma sensibilidade moral que responde às demandas específicas de cada encontro ético.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

UPDATE texts SET 
  author = 'Ana Lógica',
  content = 'A lógica formal, desde os gregos, se depara com paradoxos que desafiam sua consistência. O paradoxo do mentiroso - "esta frase é falsa" - é apenas o mais conhecido de uma família de paradoxos autorreferenciais. Russell descobriu um paradoxo similar na teoria dos conjuntos: o conjunto de todos os conjuntos que não contêm a si mesmos contém a si mesmo? Se sim, não; se não, sim.

Esses paradoxos não são meras curiosidades intelectuais. Eles revelam limitações fundamentais em nossos sistemas formais. O teorema da incompletude de Gödel mostrou que qualquer sistema formal suficientemente rico para expressar a aritmética básica é necessariamente incompleto: haverá verdades aritméticas que não podem ser provadas dentro do sistema.

A solução não está em eliminar a autorreferência, mas em compreender suas condições de possibilidade e suas limitações. Tarski, por exemplo, mostrou que a verdade de uma linguagem não pode ser definida dentro dessa mesma linguagem, mas requer uma metalinguagem. Essa hierarquia de linguagens oferece um caminho para lidar com a autorreferência de forma controlada.'
WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

UPDATE texts SET
  content = 'O que distingue a experiência estética de outras formas de experiência? Kant argumentava que o juízo estético é desinteressado - não buscamos satisfazer um desejo ou alcançar um objetivo prático, mas simplesmente contemplamos o objeto em sua forma. Mas essa contemplação desinteressada é realmente possível? Ou sempre trazemos nossas categorias, nossos interesses, nossa história para o encontro com a obra de arte?

O sublime, para Kant, é uma experiência estética particular: confrontamos algo tão vasto, tão poderoso que nossa imaginação não consegue apreendê-lo. Uma tempestade no oceano, um céu estrelado infinito, uma montanha imensa. Há um prazer peculiar nessa experiência de inadequação, porque ela revela nossa capacidade racional de pensar o infinito, mesmo quando não podemos imaginá-lo.

A arte contemporânea frequentemente busca provocar esse tipo de experiência. Instalações que nos desorientam espacialmente, obras que desafiam nossas expectativas, performances que nos confrontam com limites. A experiência estética não é mais apenas contemplação serena, mas também perturbação, questionamento, transformação.'
WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

SELECT 'Encoding corrigido com sucesso!' as status;
