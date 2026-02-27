# SaaS Template — Agent Instructions

## Overview

This is a SaaS boilerplate with a Next.js frontend, FastAPI backend, Supabase for auth + database, and Stripe for payments. All traffic routes through FastAPI — the frontend never talks to Supabase directly for data.

## Architecture

- **Frontend**: Next.js 16 App Router + Tailwind 4 + Catalyst UI components
- **Backend**: FastAPI with Pydantic models, async handlers
- **Auth**: Supabase (Google OAuth). Frontend manages sessions, backend validates JWT
- **Database**: Supabase Postgres via REST API (`/rest/v1/`). No direct Postgres connection
- **Payments**: Stripe Checkout + Webhooks. Mock mode for local dev
- **Encryption**: Fernet for any sensitive data at rest

## Code Quality Standards

### General
- Keep code simple. No premature abstractions. No over-engineering
- Every change must be minimal and focused. Do not refactor surrounding code
- No unused imports, no dead code, no commented-out code
- Do not add features that were not requested

### Python (Backend)
- **Style**: snake_case for everything. Type hints on all function signatures
- **Models**: Pydantic BaseModel for all request/response schemas
- **Async**: All route handlers and DB calls must be async
- **Auth**: Use `Depends(get_current_user)` on every authenticated endpoint
- **Errors**: Return `{"detail": "Human-readable message"}` with appropriate HTTP status codes
- **Logging**: Use `logging.getLogger("app")`. Never log secrets or tokens
- **Config**: All settings via `app/config.py` (Pydantic BaseSettings from env vars)
- **Database**: Use the `db` singleton from `app/database.py`. Never create a new client
- **New routers**: Create in `app/routers/`, register in `app/main.py`
- **New schemas**: Add to `app/schemas.py`

### TypeScript (Frontend)
- **Style**: camelCase for variables, PascalCase for components, kebab-case for file names
- **Components**: Use the Catalyst UI components in `src/components/` — do not reinvent buttons, badges, inputs, etc
- **API calls**: Use the typed functions in `src/lib/api.ts`. Add new endpoints there
- **Auth**: Supabase session handled by middleware. Use `createClient()` from `@/lib/supabase/client`
- **State**: Use React hooks. Keep state local unless shared across components
- **Styling**: Tailwind utility classes only. No CSS modules, no styled-components
- **Pages**: App Router convention. Route groups like `(marketing)` for layout separation

### Security
- Never log secrets, API keys, or tokens
- Never expose sensitive data in API responses
- All secrets go in `.env`, never hardcoded
- Validate user input with Pydantic models on the backend
- Use Fernet encryption for any sensitive data stored in DB

## File Organization

```
backend/
  app/
    main.py          — FastAPI app, CORS, health, router registration
    config.py        — All settings from env vars
    auth.py          — JWT validation (Supabase)
    database.py      — Supabase REST API client (singleton)
    schemas.py       — All Pydantic models
    routers/         — One file per feature area
    services/        — Business logic and external service adapters

frontend/
  src/
    app/             — Next.js pages (App Router)
      (marketing)/   — Public pages (landing, pricing, etc.)
      login/         — Auth page
      dashboard/     — Authenticated app
      auth/callback/ — OAuth callback
    components/      — Catalyst UI components (reusable)
    lib/
      api.ts         — Typed API client with auth headers
      supabase/      — Supabase client, server, middleware
    middleware.ts    — Next.js middleware (session refresh, route protection)
```

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **API prefix**: All endpoints under `/api/v1/`
- **Error format**: `{ "detail": "Human-readable message" }`
- **Secrets**: Never in client code, always via env vars, encrypted at rest
- **Database**: Supabase REST API only (no direct Postgres, no ORM)

## Adding a New Feature (Checklist)

1. [ ] Add Pydantic schema(s) to `backend/app/schemas.py`
2. [ ] Create router in `backend/app/routers/my_feature.py`
3. [ ] Register router in `backend/app/main.py`
4. [ ] Add SQL migration in `supabase/migrations/` (if new table)
5. [ ] Add TypeScript types and API function in `frontend/src/lib/api.ts`
6. [ ] Build UI in `frontend/src/app/` using Catalyst components
7. [ ] Test with mock mode enabled

## Available Catalyst UI Components

All in `frontend/src/components/`:

| Component | File | Usage |
|-----------|------|-------|
| Button | `button.tsx` | Primary actions, links, multiple color variants |
| Badge | `badge.tsx` | Status labels (green, red, amber, etc.) |
| Input | `input.tsx` | Form text inputs |
| Heading | `heading.tsx` | `<Heading>` and `<Subheading>` |
| Text | `text.tsx` | `<Text>`, `<Strong>`, `<Code>`, `<TextLink>` |
| Avatar | `avatar.tsx` | User avatars with initials or image |
| Divider | `divider.tsx` | Horizontal separator |
| Dialog | `dialog.tsx` | Modal dialogs with title/body/actions |
| Dropdown | `dropdown.tsx` | Dropdown menus |
| Sidebar | `sidebar.tsx` | Navigation sidebar with sections |
| SidebarLayout | `sidebar-layout.tsx` | Responsive sidebar + content layout |
| Navbar | `navbar.tsx` | Top navigation bar |
| Logo | `logo.tsx` | App logo (customizable) |
| Link | `link.tsx` | Next.js Link wrapper for Headless UI |

## Database Access Pattern

```python
from app.database import db

# SELECT
row = await db.select("table_name", filters={"user_id": str(user_id)}, single=True)
rows = await db.select("table_name", order_by="created_at", order_desc=True, limit=10)

# INSERT
new_row = await db.insert("table_name", {"column": "value"})

# UPSERT
row = await db.upsert("table_name", {"user_id": str(user_id), "data": "value"}, on_conflict="user_id")

# UPDATE
updated = await db.update("table_name", {"status": "ACTIVE"}, {"user_id": str(user_id)})

# DELETE
deleted = await db.delete("table_name", {"id": str(row_id)})
```

## Environment Variables

### Backend (`backend/.env`)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Secret service role key (backend only)
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `STRIPE_PRICE_ID` — Stripe Price ID for subscription
- `ENCRYPTION_KEY` — Fernet key for encrypting sensitive data
- `APP_URL` — Frontend URL (for CORS + Stripe redirects)
- `MOCK_STRIPE` — Set `true` for local dev without Stripe
- `DEV_USER_ID` — Set to a UUID to bypass auth for testing

### Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key
- `NEXT_PUBLIC_API_URL` — Backend API URL
