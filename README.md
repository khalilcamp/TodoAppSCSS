# TaskFlow — Mini Sistema de Tarefas

Aplicação fullstack de gestão de tarefas em estilo Kanban (colunas "A fazer" / "Em progresso" / "Concluído"), com drag-and-drop, prioridades e prazos.

## Stack

**Backend**
- Node.js + Express 5 + TypeScript
- PostgreSQL + Drizzle ORM
- Jest + Supertest (testes de integração)

**Frontend**
- React + TypeScript + Vite
- SCSS (sem framework de CSS)
- @dnd-kit (drag-and-drop)

## Estrutura do projeto

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── database/          # conexão com o Postgres
│   │   ├── schemas/           # schema Drizzle (tabela tasks)
│   │   ├── repositories/      # acesso direto ao banco
│   │   ├── services/          # regras de negócio e validação
│   │   ├── routes/            # rotas Express
│   │   ├── middlewares/       # tratamento de erro
│   │   ├── utils/             # AppError
│   │   ├── app.ts             # monta o Express (usado nos testes)
│   │   └── index.ts           # sobe o servidor
│   ├── tests/                 # testes automatizados (Jest + Supertest)
│   ├── drizzle/                # migrations geradas
│   ├── drizzle.config.ts
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── api/                # chamadas HTTP para o backend
│   │   ├── components/         # Topbar, Footer, TaskForm, TaskBoard, TaskItem, TaskDrawer
│   │   ├── styles/              # variáveis SCSS e estilos globais
│   │   └── App.tsx
│   ├── Dockerfile
│   └── .dockerignore
└── docker-compose.yml           # sobe Postgres + backend + frontend
```

## Pré-requisitos

- Docker + Docker Compose (para rodar tudo via container — recomendado)
- Node.js 20+ (só necessário para rodar sem Docker, com hot-reload)

## Como rodar — via Docker (recomendado)

Sobe o Postgres, o backend e o frontend juntos, com um comando só, na raiz do projeto:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Postgres: exposto na porta `5433` do host

As migrations do banco rodam automaticamente toda vez que o container do backend sobe — não precisa rodar nenhum comando manual.

Pra derrubar tudo:
```bash
docker-compose down
```

Pra derrubar e também apagar os dados do banco (reset completo):
```bash
docker-compose down -v
```

> **Nota:** este projeto foi desenvolvido com `docker-compose` (v1). Se sua máquina tiver o Docker Compose v2 (`docker compose`, sem hífen), prefira usá-lo — evita alguns bugs de compatibilidade conhecidos do v1 ao reconstruir imagens.

### Variáveis de ambiente (Docker)

O `docker-compose.yml` já define as credenciais do Postgres e a `DATABASE_URL` do backend internamente — não é necessário criar `.env` para rodar via Docker. Se quiser trocar usuário/senha/porta, edite diretamente o `docker-compose.yml`.

## Como rodar — modo desenvolvimento (sem Docker no backend/frontend)

Use esse modo se quiser hot-reload ao editar o código (o modo Docker acima recompila a imagem inteira a cada mudança, o que é mais lento para desenvolver).

### 1. Subir só o banco de dados

Na raiz do projeto:

```bash
docker-compose up -d postgres
```

Confirme que subiu com `docker ps`.

> Se a porta `5432` já estiver em uso na sua máquina, o `docker-compose.yml` mapeia para `5433` no host — ajuste sua `DATABASE_URL` de acordo.

### 2. Configurar variáveis de ambiente do backend

Dentro de `backend/`, copie o exemplo e ajuste com as credenciais do seu `docker-compose.yml`:

```bash
cd backend
cp .env.example .env
```

`.env`:
```
DATABASE_URL=postgres://usuario:senha@localhost:5433/nome_do_banco
PORT=3000
```

### 3. Rodar o backend

```bash
cd backend
npm install
npm run db:migrate   # aplica o schema no banco
npm run dev
```

A API sobe em `http://localhost:3000`.

### 4. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Rodando os testes (backend)

```bash
cd backend
npm test
```

Os testes usam o mesmo banco Postgres configurado na `DATABASE_URL` — não é um banco separado de teste.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/tasks` | Lista todas as tarefas |
| `POST` | `/tasks` | Cria uma tarefa (`title`, `description`, `priority`, `dueDate`) |
| `PATCH` | `/tasks/:id` | Atualiza campos de uma tarefa (`title`, `description`, `status`, `priority`, `dueDate`) |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

### Campos da tarefa

| Campo | Tipo | Observação |
|---|---|---|
| `title` | string | Obrigatório |
| `description` | string | Opcional |
| `status` | `todo` \| `in_progress` \| `done` | Padrão: `todo` |
| `priority` | `low` \| `medium` \| `high` | Padrão: `medium` |
| `dueDate` | string (ISO) ou `null` | Opcional |

## Scripts úteis (backend)

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor em modo desenvolvimento (hot-reload) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm test` | Roda os testes automatizados |
| `npm run db:generate` | Gera uma nova migration a partir do schema |
| `npm run db:migrate` | Aplica migrations pendentes no banco |
