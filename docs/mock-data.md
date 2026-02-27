# Mock Data Reference

## Data Sources

There are **two** mock data files:

1. **`src/lib/mock-data.ts`** — Main file. Contains types + data for Overview, Outreach (Smart Collector), and Voice Agent modules.
2. **`src/lib/mock-data/reviews.ts`** — Separate file with the full Review type used by the Reviews module.

### Import Patterns
```tsx
// Overview, Outreach, Voice Agent pages:
import { mockConversations, mockReviewRequests, mockVoiceAgentAnalytics } from "@/lib/mock-data";

// Reviews module pages (use the detailed type):
import { mockReviews, type Review } from "@/lib/mock-data/reviews";
```

**Why two files?** The overview page uses a simplified `Review` type (id, guestName, source, rating, text, date, responded). The reviews module uses a full `Review` type (with content, title, normalizedRating, status, response, aiDraftResponse, etc.). They are independent data sets.

---

## Types & Exports from `mock-data.ts`

### Review (simplified — for overview)
```typescript
interface Review {
  id: string;
  guestName: string;
  source: ReviewSource; // "google" | "booking" | "tripadvisor" | "expedia"
  rating: number;
  text: string;
  date: string;
  responded: boolean;
}
```
**Export**: `mockReviews` — 5 reviews

### Contact
```typescript
interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  source: "manual" | "import" | "booking";
  stayDate: string;
  roomType: string;
  tags: string[];
  createdAt: string;
}
```
**Export**: `mockContacts` — 14 contacts

### Template (legacy, still exported)
```typescript
interface Template {
  id: string;
  name: string;
  channel: "email" | "whatsapp";
  subject?: string;
  body: string;
  variables: string[];
  language: "fr" | "en" | "ar";
  createdAt: string;
  updatedAt: string;
}
```
**Export**: `mockTemplates` — 6 templates (4 email, 2 WhatsApp, in FR/EN/AR)

### Conversation
```typescript
interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  channel: "email" | "whatsapp";
  status: "sent" | "delivered" | "opened" | "replied" | "failed";
  messages: ConversationMessage[];
}
```
**Export**: `mockConversations` — 10 conversations

### ReviewMessageTemplate (Smart Collector)
```typescript
interface ReviewMessageTemplate {
  id: string;
  language: "fr" | "en" | "ar";
  channel: "whatsapp" | "email";
  messages: ReviewRequestMessage[];
  status: "approved" | "draft";
  updatedAt: string;
}

interface ReviewRequestMessage {
  id: string;
  order: number;
  body: string;       // Supports {{1}} variable for guest name
  delayDays: number;  // Days after previous message
}
```
**Export**: `mockReviewMessageTemplates` — 3 templates (FR with 1 message, EN with 1, AR with 1). One message per template only.

### ReviewRequest (Smart Collector)
```typescript
interface ReviewRequest {
  id: string;
  method: "csv" | "single" | "pms";
  channel: "whatsapp" | "email";
  guestCount: number;
  sentCount: number;
  status: "sent" | "pending" | "failed";
  createdAt: string;
}
```
**Export**: `mockReviewRequests` — 3 requests (2 CSV, 1 single). Note: no longer displayed in the UI (envois récents section removed), but type and data still exported.

### RoutingRule
```typescript
interface RoutingRule {
  id: string;
  name: string;
  condition: string;  // e.g. "note >= 4"
  action: string;     // e.g. "Rediriger vers Google Reviews"
  enabled: boolean;
}
```
**Export**: `mockRoutingRules` — 3 rules (positive→Google, negative→internal, VIP→TripAdvisor)

### VoiceAgentConfig
```typescript
interface VoiceAgentConfig {
  name: string;
  personality: string;
  languages: string[];
  greeting: string;
  fallbackMessage: string;
  maxCallDuration: number;
  transferToHuman: boolean;
  knowledgeBase: { restaurantMenu, spaServices, hotelInfo, localAttractions: boolean };
  eatNowIntegration: { enabled, status, lastSync, apiEndpoint };
}
```
**Export**: `mockVoiceAgentConfig` — agent "Sahrai"

### Call
```typescript
interface Call {
  id: string;
  callerPhone: string;
  callerName: string | null;
  startTime: string;
  endTime: string;
  duration: number; // seconds
  language: "fr" | "en" | "ar";
  intent: "restaurant_reservation" | "spa_booking" | "information" | "complaint" | "other";
  outcome: "reservation_made" | "transferred_to_human" | "information_provided" | "callback_scheduled" | "abandoned";
  reservationType?: "restaurant" | "spa";
  reservationDetails?: { date, time, partySize?, service? };
  transcript: { speaker: "agent" | "caller"; text: string; timestamp: string }[];
  sentiment: "positive" | "neutral" | "negative";
}
```
**Export**: `mockCalls` — 10 calls (5 with full transcripts in FR/EN/AR)

### VoiceAgentAnalytics
```typescript
interface VoiceAgentAnalytics {
  totalCalls: number;
  callsToday: number;
  avgDuration: number;
  reservationConversionRate: number;
  restaurantReservations: number;
  spaBookings: number;
  transferRate: number;
  satisfactionScore: number;
  callsByHour: { hour: number; count: number }[];
  callsByDay: { day: string; count: number }[];
  intentBreakdown: { intent: string; count: number; percentage: number }[];
}
```
**Export**: `mockVoiceAgentAnalytics`

### Overview Data
**Export**: `mockOverviewData` — Contains averageRating, totalReviews, responseRate, trends, sentimentByMonth, responseRateByMonth, reviewsByMonth, lastMessages (WhatsApp only), aiReceptionist stats

### VoiceAgentStatus
**Export**: `mockVoiceAgentStatus` — `{ status: "online" }`

---

## Types & Exports from `mock-data/reviews.ts`

### Review (full — for reviews module)
```typescript
interface Review {
  id: string;
  source: "booking" | "google" | "expedia" | "tripadvisor";
  guestName: string;
  guestCountry: string;
  rating: number;           // Original scale (Booking: 1-10, others: 1-5)
  normalizedRating: number; // Always 1-5
  title: string;
  content: string;
  positives?: string;       // Booking.com only
  negatives?: string;       // Booking.com only
  stayDate: string;
  reviewDate: string;
  roomType: string;
  travelType: "couple" | "family" | "business" | "solo" | "group";
  response: { content: string; respondedAt: string; respondedBy: string } | null;
  aiDraftResponse: string | null;
  status: "new" | "draft" | "responded";
  language: string;
}
```
**Export**: `mockReviews` — 18 reviews (5 Booking, 5 Google, 4 TripAdvisor, 4 Expedia)
- 6 new, 4 draft (with aiDraftResponse), 8 responded
- Languages: French and English
- Guest countries: France, UK, USA, Germany, Morocco, UAE, Spain, Italy, Japan
