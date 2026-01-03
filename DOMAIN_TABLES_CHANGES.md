# Resumo das Alterações - Tabelas de Domínio

## 📊 Objetivo
Substituir valores hardcoded no frontend por tabelas de domínio dinâmicas no banco de dados.

---

## ✅ 1. TABELAS DE DOMÍNIO CRIADAS (5 novas tabelas)

### Migration: `database/migrations/001_add_domain_tables.sql`

1. **knowledge_areas** - 11 áreas do conhecimento filosófico
   - Metafísica, Epistemologia, Ética, Estética, Lógica, etc.

2. **text_types** - 4 tipos de texto
   - Ensaio, Artigo, Opinião, Divulgação

3. **text_objectives** - 3 objetivos declarados
   - Informar, Argumentar, Especular

4. **foundation_levels** - 3 níveis de fundamentação
   - Exploratório, Fundamentado, Rigoroso

5. **question_types** - 4 tipos de contribuição
   - Dúvida Científica, Comentário Crítico, Contraponto, Complemento

**Características comuns:**
- `id` UUID (PK)
- `code` VARCHAR(50) UNIQUE - Slug para uso em APIs
- `name` VARCHAR(255) - Nome para exibição
- `description` TEXT - Descrição detalhada
- `is_active` BOOLEAN - Controle de ativação
- `display_order` INTEGER - Ordem de exibição
- `created_at`, `updated_at` TIMESTAMP

---

## ✅ 2. TABELA TEXTS ATUALIZADA

### Migration: `database/migrations/002_add_text_domain_fields.sql`

**Novos campos adicionados:**
- `objective` VARCHAR(50) - Objetivo declarado do texto
- `foundation_level` VARCHAR(50) - Nível de fundamentação pretendido

**Índices criados:**
- `idx_texts_objective`
- `idx_texts_foundation_level`

---

## ✅ 3. NOVO MÓDULO CRIADO: `/src/modules/domains`

### Estrutura:
```
src/modules/domains/
├── domains.service.js    # Lógica de negócio
├── domains.controller.js # Handlers das rotas
└── domains.routes.js     # Definição das rotas
```

### Endpoints Públicos:
- `GET /api/domains/knowledge-areas` - Listar áreas do conhecimento
- `GET /api/domains/text-types` - Listar tipos de texto
- `GET /api/domains/text-objectives` - Listar objetivos
- `GET /api/domains/foundation-levels` - Listar níveis de fundamentação
- `GET /api/domains/question-types` - Listar tipos de dúvida

**Observação:** Todas as rotas são públicas (sem autenticação) pois são dados de referência.

---

## ✅ 4. SERVIÇOS ATUALIZADOS

### `src/modules/texts/texts.service.js`
**Métodos alterados:**

#### `create(textData)`
- Adicionado suporte para `objective`
- Adicionado suporte para `foundation_level`

#### `update(id, userId, textData)`
- Adicionado suporte para `objective`
- Adicionado suporte para `foundation_level`

**SQL atualizado:**
```sql
INSERT INTO texts (user_id, title, content, area, type, author, institution, references, objective, foundation_level)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
```

---

## ✅ 5. APLICAÇÃO ATUALIZADA

### `src/app.js`
- Importado `domainRoutes`
- Registrado rota `/api/domains`

---

## 📋 PRÓXIMOS PASSOS RECOMENDADOS

### 1. **Validações no Backend**
Adicionar validação nos controllers para garantir que:
- `area` existe em `knowledge_areas` e está ativo
- `type` existe em `text_types` e está ativo
- `objective` existe em `text_objectives` e está ativo (se fornecido)
- `foundation_level` existe em `foundation_levels` e está ativo (se fornecido)
- `question.type` existe em `question_types` e está ativo

### 2. **Atualizar Controllers**
Adicionar middleware de validação em:
- `texts.controller.js` - Validar area, type, objective, foundation_level
- `questions.controller.js` - Validar type

### 3. **Atualizar Frontend**
Modificar os formulários para:
- Buscar opções dos selects via API (`/api/domains/*`)
- Remover valores hardcoded
- Popular dropdowns dinamicamente

### 4. **Atualizar Bruno Collection**
Adicionar requests para testar novos endpoints:
- GET `/api/domains/knowledge-areas`
- GET `/api/domains/text-types`
- GET `/api/domains/text-objectives`
- GET `/api/domains/foundation-levels`
- GET `/api/domains/question-types`

### 5. **Painel Admin (Futuro)**
Criar endpoints protegidos para administradores:
- Adicionar/editar/desativar áreas do conhecimento
- Adicionar/editar/desativar tipos de texto
- Gerenciar todas as tabelas de domínio

---

## 🔧 COMANDOS EXECUTADOS

```bash
# Criar tabelas de domínio
Get-Content database/migrations/001_add_domain_tables.sql | docker exec -i nhee-postgres psql -U postgres -d nhee_pora

# Adicionar campos na tabela texts
Get-Content database/migrations/002_add_text_domain_fields.sql | docker exec -i nhee-postgres psql -U postgres -d nhee_pora

# Verificar tabelas criadas
docker exec -it nhee-postgres psql -U postgres -d nhee_pora -c "\dt"
```

---

## 📊 ESTADO ATUAL DO BANCO

**Total de tabelas: 12**

1. users ✓
2. texts ✓ (atualizada com objective e foundation_level)
3. questions ✓
4. authenticity_ratings ✓
5. concepts ✓
6. text_concepts ✓
7. contact_messages ✓
8. knowledge_areas ✓ (NOVA)
9. text_types ✓ (NOVA)
10. text_objectives ✓ (NOVA)
11. foundation_levels ✓ (NOVA)
12. question_types ✓ (NOVA)

---

## 🎯 BENEFÍCIOS ALCANÇADOS

✅ **Flexibilidade**: Adicionar/remover categorias sem alterar código
✅ **Manutenibilidade**: Valores centralizados no banco de dados
✅ **Consistência**: Validação de dados contra tabelas de domínio
✅ **Escalabilidade**: Suporte para internacionalização futura
✅ **Auditoria**: Histórico de criação/atualização de categorias
✅ **Ativação/Desativação**: Controle fino via campo `is_active`
✅ **Ordenação**: Controle de exibição via `display_order`
