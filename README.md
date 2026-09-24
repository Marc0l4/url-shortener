# 🔗 URL Shortener

API REST para encurtamento de URLs, construída em Node.js com TypeScript, pensada para produção: validação de dados, rate limiting, tratamento de erros centralizado e pronta para deploy com Docker.
**🌐 Demo ao vivo:** [https://url-shortener-0dhz.onrender.com](https://url-shortener-0dhz.onrender.com)

## ✨ Funcionalidades

- Encurtamento de URLs com código gerado automaticamente
- Suporte a código customizado (slug próprio)
- Redirecionamento automático (`GET /:code`)
- Contagem de cliques por link
- Expiração opcional de links
- Rate limiting para evitar abuso
- Validação de dados com Zod
- Tratamento de erros centralizado

## 🛠️ Stack

- **Node.js** + **TypeScript**
- **Express** — framework HTTP
- **Prisma ORM** (v7) + **PostgreSQL** ([Neon](https://neon.tech))
- **Zod** — validação de schemas
- **nanoid** — geração de códigos curtos
- **Docker** — containerização

## 📦 Endpoints da API

### Criar link curto
```http
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://exemplo.com/pagina-bem-longa",
  "customCode": "meu-link"   // opcional
}
```

**Resposta (201):**
```json
{
  "shortCode": "aB3xY9z",
  "shortUrl": "https://seu-dominio.com/aB3xY9z",
  "originalUrl": "https://exemplo.com/pagina-bem-longa"
}
```

### Redirecionar
```http
GET /:code
```
Redireciona (302) para a URL original e incrementa o contador de cliques.

### Consultar estatísticas
```http
GET /api/stats/:code
```

**Resposta (200):**
```json
{
  "shortCode": "aB3xY9z",
  "originalUrl": "https://exemplo.com/pagina-bem-longa",
  "clicks": 42,
  "createdAt": "2026-01-01T12:00:00.000Z",
  "expiresAt": null
}
```

### Health check
```http
GET /health
```

## 🚀 Rodando localmente

### Pré-requisitos
- Node.js 20+
- Uma instância PostgreSQL (local ou um serviço como [Neon](https://neon.tech))

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/url-shortener.git
cd url-shortener

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# edite o .env com sua DATABASE_URL

# Rode as migrations
npx prisma migrate dev

# Suba o servidor em modo desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:3000` por padrão.

### Build para produção

```bash
npm run build
npm start
```

## 🐳 Rodando com Docker

```bash
docker build -t url-shortener .
docker run -p 3000:3000 --env-file .env url-shortener
```

## 📁 Estrutura do projeto

```
src/
├── config/       # Configuração e validação de variáveis de ambiente
├── controllers/  # Camada de request/response
├── services/     # Regras de negócio
├── routes/       # Definição de endpoints
├── middlewares/  # Rate limiting, tratamento de erros
├── types/        # Schemas Zod e tipos compartilhados
├── prisma/       # Cliente Prisma configurado
├── app.ts        # Configuração do Express
└── server.ts     # Ponto de entrada da aplicação
```

## 📄 Variáveis de ambiente

| Variável       | Descrição                          | Obrigatória |
|----------------|-------------------------------------|-------------|
| `DATABASE_URL` | Connection string do PostgreSQL     | Sim         |
| `PORT`         | Porta do servidor (padrão: 3000)    | Não         |

## ⚡ Disponibilidade

O deploy gratuito no Render "dorme" após 15 minutos de inatividade. Para manter o serviço sempre ativo, um monitor externo (UptimeRobot) faz ping na rota `/health` a cada 5 minutos.

**📊 Status em tempo real:** [stats.uptimerobot.com/M1397mOk0g](https://stats.uptimerobot.com/M1397mOk0g)
## 📝 Licença

Este projeto está sob a licença MIT.