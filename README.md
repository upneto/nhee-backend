# Nhe'ẽ porã - Backend API

Backend Node.js + Express + PostgreSQL para a plataforma de compartilhamento de textos científicos Nhe'ẽ porã.

## 🚀 Tecnologias

- **Node.js** 20.x
- **Express** - Framework web
- **PostgreSQL** 16 - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Docker** - Containerização do PostgreSQL

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker Desktop (para PostgreSQL)

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` conforme necessário.

### 3. Iniciar PostgreSQL com Docker

```bash
docker-compose up -d
```

Isso irá:
- Criar container PostgreSQL na porta 5432
- Executar migrations automáticas (arquivo `database/init.sql`)
- Criar todas as tabelas necessárias

### 4. Verificar se o banco está rodando

```bash
docker ps
```

Você deve ver o container `nhee-postgres` rodando.

## 🏃 Executando a aplicação

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor estará rodando em: **http://localhost:3000**

API disponível em: **http://localhost:3000/api**

## 📚 Endpoints da API

### Autenticação (`/api/auth`)

- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Recuperar senha
- `POST /auth/reset-password` - Resetar senha
- `GET /auth/validate-token` - Validar token JWT

### Textos (`/api/texts`)

- `GET /texts` - Listar textos (com filtros)
- `GET /texts/:id` - Obter texto específico
- `POST /texts` - Criar texto (requer auth)
- `PUT /texts/:id` - Atualizar texto (requer auth)
- `DELETE /texts/:id` - Deletar texto (requer auth)
- `GET /texts/my-texts` - Meus textos (requer auth)
- `POST /texts/:id/evaluate` - Avaliar autenticidade (requer auth)

### Questões (`/api/questions`)

- `GET /questions/texts/:textId/questions` - Listar questões de um texto
- `POST /questions/texts/:textId/questions` - Criar questão (requer auth)
- `DELETE /questions/texts/:textId/questions/:id` - Deletar questão (requer auth)

### Usuários (`/api/users`)

- `GET /users/profile` - Obter perfil (requer auth)
- `PUT /users/profile` - Atualizar perfil (requer auth)
- `POST /users/change-password` - Alterar senha (requer auth)

### Conceitos (`/api/concepts`)

- `GET /concepts` - Listar conceitos
- `GET /concepts/map` - Dados do mapa conceitual

### Contato (`/api/contact`)

- `POST /contact/send` - Enviar mensagem de contato

## 🗄️ Estrutura do Banco de Dados

### Tabelas

- **users** - Usuários do sistema
- **texts** - Textos científicos
- **questions** - Dúvidas/comentários sobre textos
- **authenticity_ratings** - Avaliações de autenticidade
- **concepts** - Conceitos filosóficos
- **text_concepts** - Relação textos ↔ conceitos
- **contact_messages** - Mensagens de contato

Ver schema completo em: `database/init.sql`

## 🔒 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

### Como usar:

1. Faça login em `/api/auth/login`
2. Receba o token no response
3. Inclua o token no header de requisições autenticadas:

```
Authorization: Bearer seu-token-jwt-aqui
```

## 🧪 Testando a API

### Health Check

```bash
curl http://localhost:3000/health
```

### Registro de usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "name": "Nome Completo"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "senha123"
  }'
```

## 🐳 Comandos Docker

### Iniciar PostgreSQL

```bash
docker-compose up -d
```

### Parar PostgreSQL

```bash
docker-compose down
```

### Ver logs do PostgreSQL

```bash
docker-compose logs -f postgres
```

### Acessar console do PostgreSQL

```bash
docker exec -it nhee-postgres psql -U postgres -d nhee_pora
```

## 📁 Estrutura de Pastas

```
backend/
├── database/
│   └── init.sql              # Schema do banco
├── src/
│   ├── database/
│   │   └── connection.js     # Conexão PostgreSQL
│   ├── modules/              # Módulos da aplicação
│   │   ├── auth/            # Autenticação
│   │   ├── texts/           # Textos
│   │   ├── questions/       # Questões
│   │   ├── users/           # Usuários
│   │   ├── concepts/        # Conceitos
│   │   └── contact/         # Contato
│   ├── shared/
│   │   └── middleware/      # Middlewares globais
│   ├── app.js               # Configuração Express
│   └── server.js            # Inicialização
├── .env                     # Variáveis de ambiente
├── .env.example            # Exemplo de .env
├── docker-compose.yml      # Docker Compose
└── package.json            # Dependências
```

## 🔧 Scripts Disponíveis

- `npm start` - Iniciar em produção
- `npm run dev` - Iniciar em desenvolvimento (nodemon)
- `npm test` - Executar testes
- `npm run lint` - Verificar código (ESLint)
- `npm run format` - Formatar código (Prettier)

## 🌐 Integração com Frontend

O frontend em `C:\Workspace\frontend\nhee-frontend` já está configurado para consumir esta API.

Ajuste a `baseURL` em `resources/services/config/api.config.js` do frontend se necessário.

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta do servidor | `3000` |
| `API_PREFIX` | Prefixo da API | `/api` |
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `nhee_pora` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres123` |
| `JWT_SECRET` | Secret do JWT | (definir) |
| `JWT_EXPIRES_IN` | Expiração do JWT | `7d` |
| `CORS_ORIGIN` | Origem permitida CORS | `http://localhost:8080` |

## 🚀 Deploy

### Render (Recomendado - $0/mês)

1. Criar conta no [Render](https://render.com)
2. Conectar repositório GitHub
3. Criar PostgreSQL database
4. Criar Web Service
5. Configurar variáveis de ambiente
6. Deploy automático!

### Railway ($5/mês)

1. Criar conta no [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Adicionar PostgreSQL
4. Deploy automático!

## 📄 Licença

MIT

---

**Nhe'ẽ porã** - Palavras Verdadeiras
