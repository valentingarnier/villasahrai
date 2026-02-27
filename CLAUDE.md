# Villa Sahrai — Hotel Management Platform

## Overview

Hotel management SaaS platform for Villa Sahrai (luxury hotel, Casablanca). Three modules: Outreach (email/WhatsApp surveys), Review Inbox (centralized reviews + AI responses), AI Voice Agent (F&B/Spa reservations). Currently **frontend-only mockup with mock data** — no backend connected.

## Architecture

- **Frontend**: Next.js 16 App Router + Tailwind CSS 4 + Catalyst UI components + Headless UI
- **Backend**: FastAPI with Pydantic models, async handlers (not yet connected for Villa Sahrai modules)
- **Auth**: Supabase (Google OAuth). Middleware skips auth when env vars are absent (demo mode)
- **Database**: Supabase Postgres via REST API (not yet used for Villa Sahrai modules)
- **Mock Data**: All module data in `src/lib/mock-data.ts` and `src/lib/mock-data/reviews.ts`

## Current State

All three modules are fully built as frontend mockups with realistic mock data. No backend, no database, no API calls for the Villa Sahrai features. The Supabase auth middleware gracefully skips when env vars are not set.

## Project Structure

```
frontend/src/
  app/
    layout.tsx                           — Root layout (Inter font, metadata)
    globals.css                          — Global styles + custom utilities
    (marketing)/                         — Public pages (landing)
    login/                               — Auth page (Supabase Google OAuth)
    auth/callback/                       — OAuth callback handler
    dashboard/
      layout.tsx                         — Shared sidebar layout (all modules)
      page.tsx                           — Overview (KPI cards, recent activity)
      outreach/
        page.tsx                         — Demande d'avis (CSV upload + single guest)
        conversations/page.tsx           — Conversation list + detail dialog
        messages/page.tsx                — Single message template per lang + phone preview
        routing/page.tsx                 — Routing rules with toggle switches
      reviews/
        page.tsx                         — Split layout: inbox list + inline detail panel
        [id]/page.tsx                    — Legacy detail page (main flow uses inline panel)
      voice-agent/
        page.tsx                         — Dashboard + analytics charts
        calls/page.tsx                   — Call history + transcript viewer
        config/page.tsx                  — Agent configuration form
  components/                            — See deep reference: components.md
  lib/
    mock-data.ts                         — Types + data for overview, outreach, voice agent
    mock-data/reviews.ts                 — Full Review type + 18 detailed reviews
    api.ts                               — Typed API client (not used in mockup)
    supabase/                            — Supabase client, server, middleware
  middleware.ts                          — Route protection (skips in demo mode)
```

## Code Quality Standards

### General
- Keep code simple. No premature abstractions. No over-engineering
- Every change must be minimal and focused. Do not refactor surrounding code
- No unused imports, no dead code, no commented-out code
- Do not add features that were not requested

### TypeScript (Frontend)
- **Style**: camelCase for variables, PascalCase for components, kebab-case for file names
- **Components**: Use Catalyst UI components — do not reinvent buttons, badges, inputs, etc
- **State**: React hooks only. Keep state local. No global state management
- **Styling**: Tailwind utility classes only. No CSS modules, no styled-components
- **Pages**: All dashboard pages are `"use client"` (need useState, usePathname)
- **Routing**: App Router nested routes. Sidebar uses `href` prop on `SidebarItem`
- **Navigation state**: `usePathname()` + `startsWith()` for nested route matching
- **Icons**: `@heroicons/react/20/solid` exclusively
- **Language**: All UI text in French (hotel operates in Morocco)

### Button Component Gotcha
The Button component uses a **discriminated union** for props. You CANNOT pass both `color` and `outline` simultaneously. Use conditional rendering:
```tsx
// WRONG: <Button color={active ? "amber" : undefined} outline={!active}>
// RIGHT:
{active ? <Button color="amber">Text</Button> : <Button outline>Text</Button>}
```

### Python (Backend) — for future development
- **Style**: snake_case. Type hints on all function signatures
- **Models**: Pydantic BaseModel for all request/response schemas
- **Async**: All route handlers and DB calls must be async
- **Auth**: `Depends(get_current_user)` on every authenticated endpoint
- **Errors**: `{"detail": "Human-readable message"}` with HTTP status codes
- **Database**: Use `db` singleton from `app/database.py`. Supabase REST API only

## Design System

- **Primary accent**: `amber-600` / `amber-500` (gold — luxury hotel feel)
- **Cards**: `rounded-xl border border-zinc-200 bg-white shadow-sm`
- **Links/CTAs**: `text-amber-600 hover:text-amber-700`
- **Status colors**: green (success/online), amber (pending/new), blue (draft/info), red (error/negative)
- **Logo**: "VS" monogram with amber gradient, text "Villa Sahrai"
- **Font**: Inter (configured via CSS variable `--font-inter`)

## Components Reference

See deep reference: [components.md](./docs/components.md) for full component API documentation.

**Catalyst (original)**: Button, Badge, Input, Heading, Text, Avatar, Divider, Dialog, Dropdown, Sidebar, SidebarLayout, Navbar, Logo, Link

**Custom (Villa Sahrai)**: Textarea, Select, StatCard, StarRating, SourceBadge, StatusDot

## Mock Data Reference

See deep reference: [mock-data.md](./docs/mock-data.md) for all types, exports, and data structure.

**Two data sources:**
- `src/lib/mock-data.ts` — Overview, Outreach, Voice Agent types + data
- `src/lib/mock-data/reviews.ts` — Full Review type with 18 detailed reviews (used by reviews module)

## Module Reference

See deep reference: [modules.md](./docs/modules.md) for detailed module documentation.

## Conventions

- **Commits**: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **API prefix**: `/api/v1/` (for future backend endpoints)
- **Error format**: `{ "detail": "Human-readable message" }`
- **Secrets**: Never in client code, always via env vars
- **Demo mode**: Middleware skips auth when `NEXT_PUBLIC_SUPABASE_URL` is not set

## Running the Project

```bash
cd frontend && npm run dev
# Open http://localhost:3000/dashboard
# No env vars needed — runs in demo mode with mock data
```

## Environment Variables

### Frontend (`frontend/.env.local`) — optional for demo
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (skip for demo mode)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anon key (skip for demo mode)
- `NEXT_PUBLIC_API_URL` — Backend API URL (default: `http://localhost:8000`)
