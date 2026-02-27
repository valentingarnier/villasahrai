# Modules Reference

## Dashboard Layout (`dashboard/layout.tsx`)

Shared layout wrapping all `/dashboard/*` pages. Uses `SidebarLayout` with sidebar navigation.

**Sidebar structure:**
- Overview → `/dashboard`
- Outreach section (SidebarHeading):
  - Smart Collector → `/dashboard/outreach`
  - Conversations → `/dashboard/outreach/conversations`
  - Messages → `/dashboard/outreach/messages`
  - Routing → `/dashboard/outreach/routing`
- Review Inbox → `/dashboard/reviews` (startsWith match for `/reviews/[id]`)
- Voice Agent → `/dashboard/voice-agent` (startsWith match for sub-pages)

**Mock user**: Mathilde Chavent, Directrice Générale (avatar initials "MC")

**Navigation**: Uses `usePathname()` from `next/navigation`. Exact match for outreach routes, `startsWith()` for Reviews and Voice Agent.

---

## Overview (`dashboard/page.tsx`)

Landing page with KPI cards, charts, and recent activity. Scrollable layout (no fixed viewport height).

**Grid layout**: 3 columns × 2 rows on desktop (`lg:grid-cols-[1fr_1.8fr_1fr]`)

**Cards:**
1. **Reviews** (R1C1): StarRating, average rating, trend arrow, sparkline chart, total reviews + response rate, 3 latest reviews (clickable, from `mock-data/reviews.ts`), "Voir tous les avis" link
2. **Sentiment Performance** (R1C2): Tab switcher (Overall/Positive/Negative), interactive line chart with hover tooltips
3. **AI Receptionist** (R1C3): StatusDot, bookings today, calls today, link to voice-agent
4. **Tendances** (R2C1): Best & worst trend cards with scores and arrows
5. **Taux de réponse** (R2C2): Interactive line chart with current week stat
6. **Derniers messages** (R2C3): WhatsApp messages only, links to `/dashboard/outreach/conversations`

**Data imports**: `mockOverviewData`, `mockVoiceAgentStatus` from `@/lib/mock-data`, `mockReviews` from `@/lib/mock-data/reviews`

---

## Module 1: Outreach (Smart Collector)

### Smart Collector (`outreach/page.tsx`)
Send review requests individually or in bulk.

**Features:**
- Header with phone icon + title "Demande d'avis"
- **2 tabs** (pill-style toggle): Import CSV | Client unique
- **Channel toggle**: WhatsApp (green) / Email (blue) with colored ring indicator
- **CSV tab**: drag-and-drop upload zone (dashed border), format hint (`nom;telephone;langue`), download sample CSV button
- **Single guest tab**: form with name, phone/email (adapts to channel), language select (FR/EN/AR)
- **Send button**: full-width amber, disabled when no data

**Removed**: PMS integration tab, envois récents section

### Conversations (`outreach/conversations/page.tsx`)
Conversation list with search and filtering.

**Features:**
- Search input + channel filter toggle (Tous/WhatsApp/Email)
- Conversation cards: Avatar initials, contact name, last message preview (prefixed "Vous :" or contact name), status badge, timestamp
- **Detail Dialog**: contact info (phone, email — no séjour info), chat bubbles (outbound = amber-50 right-aligned, inbound = zinc-100 left-aligned)
- Empty state: "Aucune conversation trouvée"

**Data**: `mockConversations`

### Messages (`outreach/messages/page.tsx`)
Message template management with WhatsApp phone preview.

**Layout**: Two columns on lg (`grid-cols-[1fr_340px]`)

**Left column (editor):**
- Language selector: FR/EN/AR buttons + add button (conditional Button rendering for active state)
- Available variables box: `{{1}}` = Nom du client
- Single message card per template: "Message 1" label, status badge (Approuvé/Brouillon), edit pencil icon
- Edit mode: Textarea + save/cancel buttons
- No "add message" button (1 message per template only)

**Right column (phone preview, hidden on mobile):**
- WhatsApp phone mockup: dark frame, green header bar with "Villa Sahrai" + "en ligne", chat area with green bubbles (`bg-[#dcf8c6]`), `{{1}}` replaced with "John", input bar at bottom

**Data**: `mockReviewMessageTemplates`

### Routing (`outreach/routing/page.tsx`)
Routing rule configuration.

**Features:**
- Header with "Ajouter une règle" button
- Rule cards: icon, name, condition badge ("Si note >= 4"), arrow, action badge ("Rediriger vers Google Reviews")
- Toggle switch per rule (amber when enabled)
- Delete button per rule
- **Add Rule Dialog**: name, condition, action inputs
- Empty state with icon + "Ajouter une règle" button

**Data**: `mockRoutingRules`

---

## Module 2: Review Inbox

### Inbox with Inline Detail (`reviews/page.tsx`)
Split-layout review inbox. Gmail-style list on left, detail panel on right.

**Layout**: `flex h-[calc(100vh-8rem)]` — full height with header/filters as shrink-0, list+panel as flex-1.

**Header:**
- Title: "Review Inbox"
- Stats pills: Total count (zinc border) + Répondus count (green border)

**Filters** (single row, no wrap):
- Search InputGroup (w-64)
- 4 SourceBadge logo toggles (opacity-40 when inactive)
- Rating select (Toutes notes / 1-5 étoiles)
- Status select (Tous statuts / Non répondu / Répondu)

**Review list** (left):
- Width: `w-[420px]` when detail open, `w-full` when closed
- Scrollable, rounded-xl border
- Each review button: guest name + StarRating + date, content preview (line-clamp-1), SourceBadge logo + "Répondu" badge if responded
- Selected review: `bg-amber-50/50`
- No "Nouveau" or "Brouillon" badges, no left border indicators

**Detail panel** (right, shown when review selected):
- Header: SourceBadge logo + publish date + close (X) button, guest name + stars + Répondu badge
- Review content: full text, Booking.com positives/negatives sections
- Scores bar: NPS (/100) + Quality Score (/10) in zinc-50 rounded box
- Reply area (pinned to bottom): language Select, Textarea, action buttons (Générer une réponse / Sauvegarder / Envoyer)
- Generate simulates 1.5s AI response

**Data**: `mockReviews` from `@/lib/mock-data/reviews`

### Legacy Detail (`reviews/[id]/page.tsx`)
Original full-page review detail. Still exists but main flow uses inline panel on the inbox page.

---

## Module 3: Voice Agent

### Dashboard (`voice-agent/page.tsx`)
Analytics dashboard with charts.

**Sub-navigation**: Tab-style links across all 3 voice agent pages (Tableau de bord / Historique d'appels / Configuration). Active tab: `border-b-2 border-amber-600 text-amber-600`.

**Features:**
- StatusDot "En ligne" in header
- 4 StatCards: calls today, conversion rate, avg duration, satisfaction
- Eat Now integration card: status badge, last sync, "Synchroniser" button
- **Charts (built with styled divs, no chart library):**
  - Calls by hour: horizontal bars (8h-22h) with percentage widths
  - Intent breakdown: colored percentage bars per intent
  - Calls this week: 7 vertical bars (Mon-Sun)
- Recent calls list (5 most recent) with intent/outcome badges + sentiment dots

**Data**: `mockVoiceAgentConfig`, `mockCalls`, `mockVoiceAgentAnalytics`

### Call History (`voice-agent/calls/page.tsx`)
Full call list with expandable transcripts.

**Features:**
- Filters: date range, intent, outcome, search
- Call rows: date/time, caller name/phone, duration, language badge, intent badge, outcome badge, sentiment dot
- **Expandable transcripts**: click a row to toggle chat-bubble view below it
  - Agent messages: left-aligned, `bg-zinc-100`
  - Caller messages: right-aligned, `bg-amber-50`
  - Reservation details card shown when applicable
  - "Transcription non disponible" for empty transcripts
- State: `expandedCallId` via useState

**Data**: `mockCalls`

### Configuration (`voice-agent/config/page.tsx`)
Agent configuration form.

**Sections:**
1. Agent Identity: name Input, personality Textarea, language checkboxes, greeting Textarea, fallback Textarea
2. Behavior: max call duration (number), transfer toggle (Activé/Désactivé buttons)
3. Knowledge Base: 4 toggleable rows with icons + status badges
4. Eat Now Integration: status, API endpoint, last sync, test/disconnect buttons
5. Save button: amber, simulated 1s save with success message

**Data**: `mockVoiceAgentConfig`
