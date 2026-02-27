# SaaS Template

Production-ready SaaS boilerplate with Next.js, FastAPI, Supabase, and Stripe.

## What's Included

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + Tailwind 4 + Catalyst UI + Headless UI |
| Backend | FastAPI + Pydantic + httpx |
| Auth | Supabase (Google OAuth) |
| Database | Supabase Postgres (REST API) |
| Payments | Stripe (Checkout + Subscriptions + Webhooks) |
| Encryption | Fernet (cryptography lib) |

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Authentication > Providers** and enable **Google** (add your Google OAuth credentials)
3. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
4. Copy your project URL, anon key, and service role key

### 2. Set Up Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Frontend
cp frontend/.env.example frontend/.env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Install Dependencies

```bash
# Backend (requires Python 3.12+ and uv)
cd backend
uv sync

# Frontend (requires Node.js 20+ and pnpm)
cd frontend
pnpm install
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
MOCK_STRIPE=true uv run uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
pnpm dev
```

### 5. Verify

- Open [http://localhost:3000](http://localhost:3000) — you should see the landing page
- Click "Get Started" — redirects to login
- Sign in with Google — redirects to dashboard
- Dashboard shows "All Systems Ready" with green badges
- Click "Call /api/v1/hello" — shows API response

## Project Structure

```
/
├── frontend/                    # Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/     # Landing page (/)
│   │   │   ├── login/           # Google OAuth login
│   │   │   ├── dashboard/       # Authenticated dashboard
│   │   │   └── auth/callback/   # OAuth callback handler
│   │   ├── components/          # Catalyst UI components
│   │   │   ├── button.tsx       # Button with color variants
│   │   │   ├── badge.tsx        # Status badges
│   │   │   ├── sidebar.tsx      # Navigation sidebar
│   │   │   ├── sidebar-layout.tsx # Responsive sidebar layout
│   │   │   ├── dialog.tsx       # Modal dialogs
│   │   │   ├── dropdown.tsx     # Dropdown menus
│   │   │   ├── input.tsx        # Form inputs
│   │   │   ├── heading.tsx      # Typography
│   │   │   ├── text.tsx         # Text components
│   │   │   ├── avatar.tsx       # User avatars
│   │   │   ├── divider.tsx      # Dividers
│   │   │   ├── navbar.tsx       # Top navigation
│   │   │   ├── logo.tsx         # App logo
│   │   │   └── link.tsx         # Next.js Link wrapper
│   │   └── lib/
│   │       ├── api.ts           # API client (typed, auth headers)
│   │       └── supabase/        # Supabase client/server/middleware
│   └── .env.example
│
├── backend/                     # FastAPI app
│   ├── app/
│   │   ├── main.py              # App setup, CORS, health, routers
│   │   ├── config.py            # Pydantic Settings from env
│   │   ├── auth.py              # Supabase JWT validation
│   │   ├── database.py          # Supabase REST API client
│   │   ├── schemas.py           # Pydantic request/response models
│   │   ├── routers/
│   │   │   ├── hello.py         # GET /hello (test endpoint)
│   │   │   ├── users.py         # GET /users/me
│   │   │   ├── checkout.py      # POST /checkout, GET /subscription
│   │   │   └── webhooks.py      # POST /webhooks/stripe
│   │   └── services/
│   │       └── encryption.py    # Fernet encrypt/decrypt
│   └── .env.example
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Subscriptions table + RLS
│
├── CLAUDE.md                    # AI agent instructions
└── README.md                    # This file
```

## Architecture

```
Browser → Next.js (Vercel)
            ↓ API calls with Supabase JWT
         FastAPI (Render/Railway)
            ↓ REST API with service role key
         Supabase Postgres
```

- Frontend **never** talks to Supabase directly for data — all through FastAPI
- Frontend uses Supabase **only** for auth (login, session, JWT)
- Backend validates JWT on every request via Supabase `/auth/v1/user`
- Backend uses service role key for all database operations

## Auth Flow

1. User clicks "Sign in with Google" on `/login`
2. Supabase redirects to Google consent screen
3. Google redirects back to `/auth/callback`
4. Callback exchanges code for session (sets cookies)
5. Middleware redirects to `/dashboard`
6. Dashboard calls backend API with JWT in `Authorization` header
7. Backend validates JWT against Supabase

## Stripe Flow

1. User clicks "Subscribe" → `POST /api/v1/checkout`
2. Backend creates Stripe Checkout Session → returns URL
3. Frontend redirects to Stripe Checkout
4. User pays → Stripe webhook fires → `POST /api/v1/webhooks/stripe`
5. Backend creates/updates subscription record in DB
6. Dashboard shows subscription status

### Local Stripe Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks
stripe listen --forward-to localhost:8000/api/v1/webhooks/stripe

# Copy the webhook signing secret (whsec_...) to your .env
```

## Adding Features

### New API Endpoint

1. Create `backend/app/routers/my_feature.py`
2. Add Pydantic models to `backend/app/schemas.py`
3. Register in `backend/app/main.py`: `app.include_router(my_feature.router, prefix="/api/v1")`
4. Add API function in `frontend/src/lib/api.ts`

### New Database Table

1. Create `supabase/migrations/002_my_table.sql`
2. Run it in Supabase SQL Editor
3. Use `db.select()`, `db.insert()`, etc. in your router

### New Dashboard Section

1. Add a new section type to the `Section` union in `dashboard/page.tsx`
2. Add a `SidebarItem` in the sidebar
3. Add content in the section rendering block

## Deployment

| Service | Deploy To | Notes |
|---------|-----------|-------|
| Frontend | Vercel | `cd frontend && pnpm build` |
| Backend | Render / Railway | `cd backend && uv run uvicorn app.main:app` |
| Database | Supabase | Cloud-hosted Postgres |

### Environment Variables for Production

Update `APP_URL` and `API_URL` in both frontend and backend `.env` files to point to your production URLs. CORS is auto-configured from `APP_URL`.

## Mock Mode

For local development without Stripe credentials:

```bash
MOCK_STRIPE=true  # Skips Stripe, auto-returns fake checkout URL
DEV_USER_ID=xxx   # Bypass auth, use this Supabase user UUID
```
