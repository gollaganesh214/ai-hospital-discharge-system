# AI Powered Smart Hospital Management System

Full-stack demo project with a React + Vite frontend, Node.js + Express backend, and PostgreSQL database. Includes pgAdmin for database workbench and Prisma ORM for schema/migrations.

## Quick start (local)

1. Start the database and pgAdmin:

```bash
cd "C:\Users\ganes\ai powered smart hospital management system"
docker compose up -d
```

2. Backend:

```bash
cd "C:\Users\ganes\ai powered smart hospital management system\backend"
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Set `OPENAI_API_KEY` in `backend/.env` to enable real AI summaries (optional).

3. Frontend:

```bash
cd "C:\Users\ganes\ai powered smart hospital management system\frontend"
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:4000
pgAdmin: http://localhost:5050

## Features

- Login, registration, forgot-password flow
- Role-based access (Admin/Doctor/Nurse)
- Patient registry
- Admissions tracking
- Laboratory module (lab reports)
- AI-assisted discharge summary draft (OpenAI optional)
- Reports dashboard
- User management
- REST API with validation
- Prisma schema + migrations

## Structure

- `backend/` Express API + Prisma
- `frontend/` React UI
- `db/` SQL utilities
- `docs/` architecture and API

## First-time setup

Create the initial admin via the registration screen and select role `ADMIN`.


## pgAdmin login

- Email: `admin@hospital.local`
- Password: `admin123`

## Postgres connection

- Host: `localhost`
- Port: `5432`
- Database: `ai_hospital`
- User: `postgres`
- Password: `postgres`
