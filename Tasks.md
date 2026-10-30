# Bookie — Project Tasks

> WhatsApp-based appointment booking platform for local service businesses.
> Stack: Node, Express, Prisma, PostgreSQL (Neon), React, Material UI, WhatsApp Cloud API

---

## Phase 1 — Project Setup & Database Foundation

> Goal: Get the project skeleton running locally with the database connected and all tables created. Nothing works end-to-end yet — but the foundation is solid.

- [x] **Initialise monorepo structure** — create `/server` and `/client` folders in one root project
- [x] **Set up Node + Express server** — basic `index.js`, port running, health check route `GET /health` returning `{ status: "ok" }`
- [x] **Connect to Neon PostgreSQL** — create a free Neon project, get the connection string, add it to `.env`
- [x] **Install and configure Prisma** — `npx prisma init`, point `DATABASE_URL` to Neon
- [x] **Write the Prisma schema** — define all models: `User`, `Business`, `Staff`, `Service`, `StaffService`, `WorkingHours`, `Holiday`, `Booking`, `ConversationState`
- [x] **Understand every field before writing it** — for each model, ask: what does this store, why is it a relation, what would break without it
- [x] **Run first migration** — `npx prisma migrate dev --name init`, verify tables appear in Neon dashboard
- [x] **Seed the database** — write a `seed.ts` that creates one test business, one staff member, and one service
- [x] **Verify with Prisma Studio** — run `npx prisma studio`, confirm seeded data looks correct
- [x] **Add `.env.example`** — document all required env vars: `DATABASE_URL`, `JWT_SECRET`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `AI_API_KEY`

---

## Phase 2 — Authentication & Business Onboarding

> Goal: A business owner can register, log in, and get a JWT back. Protected routes reject requests without a valid token. Understand exactly how JWT works before moving on.

- [x] **Understand JWT before coding** — read how signing, payload, and verification work. Know what `jsonwebtoken.sign()` and `verify()` do
- [x] **Install dependencies** — `bcrypt`, `jsonwebtoken`, `express-validator`
- [x] **POST /api/auth/register** — hash password with bcrypt, create User + Business in DB, return JWT
- [x] **POST /api/auth/login** — find user by email, compare password hash, return JWT on match
- [x] **Write auth middleware** — `authenticateToken` middleware that reads `Authorization: Bearer <token>` header and attaches `req.user`
- [x] **Protect a test route** — add `GET /api/me` that returns the logged-in user's info, test that it fails without a token
- [x] **Test all auth routes in Thunder Client / Postman** — register → login → access protected route → verify rejection without token
- [x] **PATCH /api/business/profile** — update business name, address, hours, timezone (protected)
- [x] **Understand multi-tenancy** — every subsequent query must filter by the logged-in owner's `businessId`. Write a note to yourself about why this matters

---

## Phase 3 — Core Business Configuration APIs

> Goal: A business owner can fully configure their business — services, staff, schedules, and holidays — through the API. All routes are protected. Test every route in Postman before moving to the frontend.

### Services

- [x] **GET /api/services** — list all services for the logged-in business
- [x] **POST /api/services** — create a service (name, duration, price, isActive)
- [x] **PATCH /api/services/:id** — update a service
- [x] **DELETE /api/services/:id** — delete a service (understand what happens to bookings if a service is deleted)

### Staff

- [x] **GET /api/staff** — list all staff for the business
- [x] **POST /api/staff** — create a staff member
- [x] **PATCH /api/staff/:id** — update staff details
- [x] **DELETE /api/staff/:id** — deactivate staff (soft delete — don't destroy booking history)

### Staff–Service Mapping

- [x] **POST /api/staff/:id/services** — assign services to a staff member
- [x] **Understand the join table** — `StaffService` links staff to services. Know why this is a many-to-many and how Prisma handles it

### Working Hours

- [x] **POST /api/staff/:id/hours** — set working hours per day for a staff member
- [x] **GET /api/staff/:id/hours** — fetch working schedule
- [x] **PATCH /api/staff/:id/hours** — update schedule

### Holidays

- [x] **GET /api/holidays** — list blocked dates for the business
- [x] **POST /api/holidays** — add a blocked date with reason
- [x] **DELETE /api/holidays/:id** — remove a blocked date

---

## Phase 4 — Dynamic Slot Generation & Booking Engine

> Goal: The system can compute available slots dynamically given a staff member, service, and date — without storing thousands of pre-generated slots. This is the most algorithmically interesting phase.

- [ ] **Understand slot generation logic on paper first** — given working hours 9–6, service duration 30 min, lunch 1–2, and two existing bookings at 10:30 and 2:00 — manually compute what slots should be available. Do this before writing any code
- [ ] **Write `generateSlots(staffId, serviceId, date)` utility** — pure function that returns available time slots as an array
  - Fetch staff working hours for that day
  - Check if date is a holiday
  - Fetch existing bookings for that staff on that date
  - Subtract booked and break windows from working hours
  - Return remaining slots in service-duration increments
- [ ] **GET /api/slots?staffId=&serviceId=&date=** — API route that calls the generator and returns slots
- [ ] **POST /api/bookings** — create a booking (validate the slot is still free, create booking record)
- [ ] **Handle race condition** — two customers requesting the same slot simultaneously. Use a Prisma transaction to check availability and create the booking atomically
- [ ] **GET /api/bookings** — list all bookings for the business (with filters: today, upcoming, cancelled)
- [ ] **PATCH /api/bookings/:id/cancel** — cancel a booking, update status
- [ ] **Test slot generation thoroughly** — edge cases: staff has no hours that day, date is a holiday, all slots are booked, service duration longer than remaining window

---

## Phase 5 — WhatsApp Integration, Intent Parsing & Conversation State Machine

> Goal: A customer sends a WhatsApp message in natural language, the LLM extracts their intent, and the state machine guides them through booking a slot. The booking is saved. The conversation state persists across messages. This is the core product feature.

### WhatsApp Setup

- [ ] **Set up WhatsApp Cloud API** — create a Meta developer app, get a test phone number, configure webhook URL
- [ ] **Understand webhooks before coding** — a webhook is a stateless HTTP POST. Every message is a fresh request. The system has no memory between calls — that's the problem `ConversationState` solves
- [ ] **GET /api/webhook** — respond to Meta's webhook verification challenge (`hub.challenge`)
- [ ] **POST /api/webhook** — receive incoming messages, extract sender phone and message body, pass to `handleMessage`

### Intent Parser (AI Layer)

- [ ] **Understand the contract before coding** — the parser receives (step, message, context) and always returns `{ intent, value }`. Write this shape on paper before touching the API
- [ ] **Install Anthropic SDK** — `npm install @anthropic-ai/sdk`, add `ANTHROPIC_API_KEY` to `.env`
- [ ] **Write `parseIntent(step, message, context)` function** — calls Claude API with a system prompt that enforces JSON-only output, passes current step and valid options as context
- [ ] **Write the system prompt** — instruct the model to return only valid JSON matching `{ intent: "selected" | "cancel" | "unclear", value: <normalised value or null> }`. No markdown, no prose
- [ ] **Handle structured output validation** — after the API responds, parse the JSON and validate the shape. If it does not match, return `{ intent: "unclear", value: null }` rather than crashing
- [ ] **Test the parser in isolation** — write a small test script that calls `parseIntent` directly with sample inputs for each step. Confirm it returns the correct shape before wiring it into the state machine

### State Machine

- [ ] **Design the state machine on paper first** — for each state write: what context is passed to the parser, what a valid response looks like, what gets stored in ConversationState, what the bot replies
- [ ] **Implement `handleMessage(phone, businessId, message)`** — reads current state from DB, calls `parseIntent`, routes to the correct step handler
- [ ] **IDLE handler** — greet customer, list services, move to `SELECTING_SERVICE`
- [ ] **SELECTING_SERVICE handler** — pass service list as context to parser, match returned value to a real service in DB, store `serviceId`, move to `SELECTING_STAFF`
- [ ] **SELECTING_STAFF handler** — pass staff list as context, store `staffId`, move to `SELECTING_DATE`
- [ ] **SELECTING_DATE handler** — pass current date as context so parser can resolve relative dates ("this Saturday"), validate result is not a holiday, move to `SELECTING_SLOT`
- [ ] **SELECTING_SLOT handler** — call slot generator, pass available slots as context, store selected slot, move to `CONFIRMING`
- [ ] **CONFIRMING handler** — parse YES/NO intent, create booking on YES, send confirmation, reset state to `IDLE`
- [ ] **Fallback** — any `{ intent: "unclear" }` response re-prompts the current step without advancing
- [ ] **Cancel intent** — any step that returns `{ intent: "cancel" }` resets state to `IDLE` with an acknowledgement message

### Finishing Up

- [ ] **QR code generation** — generate a WhatsApp deep link and QR code for each business's unique booking URL
- [ ] **Test full conversation flow end-to-end** — send real WhatsApp messages using natural language, complete a booking, verify it appears in the dashboard

---

## Phase 6 — Owner Dashboard (React) & Deployment

> Goal: The owner has a working dashboard to view bookings, manage configuration, and cancel appointments. The app is deployed and accessible publicly.

### Dashboard Setup

- [ ] **Initialise React app** — Vite + React in `/client`, install Material UI, React Router, TanStack Query, Axios
- [ ] **Set up Axios instance** — base URL from env, attach JWT token to every request via interceptor
- [ ] **Set up React Router** — routes: `/login`, `/dashboard`, `/services`, `/staff`, `/bookings`
- [ ] **Protect routes** — redirect to `/login` if no token in localStorage

### Auth UI

- [ ] **Login page** — email + password form, calls `/api/auth/login`, stores JWT, redirects to dashboard
- [ ] **Logout** — clear token, redirect to login

### Dashboard Pages

- [ ] **Dashboard overview** — cards: today's bookings count, upcoming bookings, active staff, total services. Tables: today's schedule, recent bookings
- [ ] **Bookings page** — table with customer name, phone, service, staff, date, time, status. Filter tabs: Today / Upcoming / Cancelled. Cancel button on each row
- [ ] **Services page** — list services, add service form, edit inline, toggle active/inactive
- [ ] **Staff page** — list staff, add staff form, assign services to staff, set working hours per day
- [ ] **QR Code page** — display the business's WhatsApp booking QR code with a download button

### Real-time Updates

- [ ] **Poll bookings every 10 seconds** — use TanStack Query's `refetchInterval` so new WhatsApp bookings appear without refresh

### Deployment

- [ ] **Deploy backend to Railway** — add env vars, get public URL
- [ ] **Update WhatsApp webhook URL** — point Meta to the Railway URL instead of localhost
- [ ] **Deploy frontend to Vercel** — add `VITE_API_URL` env var pointing to Railway backend
- [ ] **Smoke test in production** — send a WhatsApp message, complete a booking, verify it appears in the deployed dashboard

---
