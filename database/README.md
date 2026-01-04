# Database - Boas Práticas

## Encoding UTF-8 para Português

**IMPORTANTE**: Sempre que inserir dados em tabelas, especialmente com caracteres especiais do português (ã, á, é, ê, í, ó, õ, ú, ç), siga estas regras:

### 1. Configurar Encoding no Início do Arquivo SQL

```sql
SET client_encoding = 'UTF8';
```

### 2. Usar Prefixo E'' para Strings com Caracteres Especiais

Para strings que contêm caracteres especiais do português, use o prefixo `E''`:

```sql
-- ❌ ERRADO
INSERT INTO concepts (name, description) VALUES
('Consciência', 'Estado de percepção');

-- ✅ CORRETO
INSERT INTO concepts (name, description) VALUES
(E'Consciência', E'Estado de percepção');
```

### 3. Exemplos Comuns

```sql
-- Nomes e descrições
INSERT INTO users (name, bio) VALUES
(E'João Silva', E'Pesquisador em metafísica');

-- Conteúdo de textos
INSERT INTO texts (title, content) VALUES
(E'Título com Acentuação', E'Conteúdo com caracteres especiais: ação, reflexão, cognição');

-- Conceitos
INSERT INTO concepts (name, description) VALUES
(E'Consciência', E'Estado de percepção e autoconsciência'),
(E'Ética', E'Filosofia moral'),
(E'Experiência', E'Vivência consciente');
```

## Scripts de Manutenção

### Executar Seed

```bash
# Windows PowerShell
$content = Get-Content database/seed.sql -Raw
$content | docker exec -i nhee-postgres psql -U postgres -d nhee_pora
```

### Corrigir Encoding Existente

Se os dados já foram inseridos com encoding incorreto:

```bash
docker cp database/fix_encoding.sql nhee-postgres:/tmp/fix_encoding.sql
docker exec nhee-postgres psql -U postgres -d nhee_pora -f /tmp/fix_encoding.sql
```

## Verificar Encoding

```sql
-- Ver configuração atual
SHOW client_encoding;

-- Verificar dados com acentuação
SELECT name FROM concepts WHERE name LIKE '%ncia%';
```

## Estrutura do Banco

- `init.sql` - Estrutura inicial das tabelas
- `seed.sql` - Dados de teste (deve ter `SET client_encoding = 'UTF8';` no início)
- `migrations/` - Alterações incrementais no schema
- `fix_encoding.sql` - Script para corrigir encoding de dados existentes
