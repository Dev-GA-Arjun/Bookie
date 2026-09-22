# Bookie

> WhatsApp-based appointment booking platform for local service businesses.
> Tier-2 city salons, parlours, barbershops, tailors — no app, no website, just WhatsApp.

---

## Problem

Local service businesses in tier-2 cities run entirely on phone calls and walk-ins. They have no digital presence beyond word of mouth. The result: missed calls during busy hours, double bookings, no-shows, and zero visibility into the day ahead.

On the customer side, calling to book feels like friction. But these same customers are already on WhatsApp all day. The tool they need already lives on their phone — nobody has connected it to the salon yet.

---

## Solution

Bookie is a multi-tenant SaaS platform where customers book appointments through a guided WhatsApp conversation. No app install. No account creation. They scan a QR code, chat with a booking assistant, and reserve a slot.

Each business gets its own dashboard to manage staff, services, schedules, and bookings. The platform runs multiple businesses from a single backend with complete data isolation between tenants.

---

## How It Works

**Customer side:**

```
Scan QR code at the salon
        ↓
WhatsApp opens with a pre-filled message
        ↓
Bot greets the customer and shows services
        ↓
Customer picks: Service → Staff → Date → Slot
        ↓
Booking confirmed via WhatsApp message
        ↓
Dashboard updates in real time
```

**Example conversation:**

```
Bot:      "Welcome to Glow Salon! Choose a service:
           1. Hair Cut
           2. Facial
           3. Beard Trim"

Customer: "1"

Bot:      "Choose a staff member:
           1. Alice
           2. Bob (any available)"

Customer: "1"

Bot:      "Choose a date (e.g. 25 July):"

Customer: "25 July"

Bot:      "Available slots:
           1. 9:00 AM
           2. 10:30 AM
           3. 2:00 PM"

Customer: "2"

Bot:      "Confirm booking?
           Service: Hair Cut | Staff: Alice | 10:30 AM, 25 July
           Reply YES or NO"

Customer: "YES"

Bot:      "Booking confirmed! See you at 10:30 AM on 25 July.
           Alice will be ready for you. ✓"
```

No free-form AI conversation in V1. The flow is fully guided with predefined prompts.

---

## User Roles

**Business Owner**

- Register and configure their business
- Manage services, staff, working hours, and holidays
- View and manage all bookings from the dashboard
- Generate and display their WhatsApp QR code
  **Customer**
- Scan the QR code
- Book an appointment via WhatsApp
- Receive confirmation
  **Platform Admin** _(future)_
- Manage all businesses on the platform
- View platform-wide statistics
- Suspend or activate accounts

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | React, Material UI, React Router, TanStack Query, Axios |
| Backend    | Node.js, Express.js                                     |
| ORM        | Prisma                                                  |
| Database   | PostgreSQL (Neon)                                       |
| Auth       | JWT, bcrypt                                             |
| WhatsApp   | WhatsApp Cloud API (Meta)                               |
| Deployment | Vercel (frontend), Railway or Render (backend)          |

PostgreSQL is chosen over MongoDB because the data is relational — businesses have staff, staff have services, services have bookings. Foreign key constraints enforce integrity at the database level. Prisma sits on top as a TypeScript-first ORM that stays close to raw SQL.

---

## Architecture

```
Customer (WhatsApp)
        ↓
WhatsApp Cloud API → Webhook POST
        ↓
Node / Express Backend
        ↓
Conversation State Manager (ConversationState table in PostgreSQL)
        ↓
PostgreSQL — Neon
(User, Business, Staff, Service, StaffService,
 WorkingHours, Holiday, Booking, ConversationState)
        ↓
React Dashboard (business owner)
        ↓
WhatsApp Cloud API (outbound confirmation to customer)
```

Webhooks are stateless — every incoming WhatsApp message is a fresh HTTP POST with no memory of prior messages. Conversation state (where each phone number is in the booking flow) is stored per customer in the `ConversationState` table. This is the core engineering problem the system solves.

---

## Database Schema

```
User
  id, name, email, passwordHash, createdAt
  └── has one Business

Business
  id, userId, name, address, phone, timezone, bookingSlug, createdAt
  └── has many Staff, Services, Holidays, Bookings

Staff
  id, businessId, name, phone, isActive, createdAt
  └── has many StaffService, WorkingHours

Service
  id, businessId, name, durationMins, price, isActive, createdAt
  └── has many StaffService, Bookings

StaffService (join table)
  id, staffId, serviceId
  → many-to-many: one staff member offers multiple services

WorkingHours
  id, staffId, dayOfWeek, startTime, endTime, breakStart, breakEnd

Holiday
  id, businessId, date, reason

Booking
  id, businessId, staffId, serviceId, customerPhone, customerName,
  date, startTime, status (confirmed | cancelled | no_show), createdAt

ConversationState
  id, customerPhone, businessId, step, serviceId, staffId, date,
  availableSlots (JSON), lastUpdated
```

**Why foreign keys matter:** PostgreSQL blocks deleting a staff member with active bookings unless you handle it in application logic. This prevents orphaned booking records without writing extra guards.

---

## Conversation State Machine

The state machine is the core of the WhatsApp bot. Each customer phone number has exactly one row in `ConversationState` that tracks where they are in the flow.

```
IDLE
  ↓  (customer sends any message)
SELECTING_SERVICE
  ↓  (customer sends a number)
SELECTING_STAFF
  ↓  (customer sends a number)
SELECTING_DATE
  ↓  (customer sends a date)
SELECTING_SLOT
  ↓  (customer sends a number)
CONFIRMING
  ↓  (customer sends YES)
BOOKED → resets to IDLE

At any step: unrecognised input → re-prompt the current step
Customer sends "cancel" → reset to IDLE with a message
```

---

## Dynamic Slot Generation

Slots are not pre-stored in the database. They are computed on demand from:

- Staff working hours for the selected day
- Service duration
- Break timings (e.g. lunch 1–2 PM)
- Existing confirmed bookings for that staff on that date
- Holidays (blocked dates return no slots)
  **Example:**

```
Working hours:   9:00 AM – 6:00 PM
Service:         30 mins
Break:           1:00 PM – 2:00 PM
Existing bookings: 10:30 AM, 2:00 PM

Generated available slots:
9:00 AM, 9:30 AM, 10:00 AM, 11:00 AM, 11:30 AM,
12:00 PM, 12:30 PM, 2:30 PM, 3:00 PM, 3:30 PM, ...
```

This avoids storing thousands of rows and keeps the DB lean.

---

## Core API Routes

**Auth**

- `POST /api/auth/register` — create user + business, return JWT
- `POST /api/auth/login` — verify credentials, return JWT
  **Business**
- `PATCH /api/business/profile` — update name, address, timezone _(protected)_
  **Services**
- `GET /api/services` — list services for logged-in business
- `POST /api/services` — create a service
- `PATCH /api/services/:id` — update a service
- `DELETE /api/services/:id` — delete a service
  **Staff**
- `GET /api/staff` — list staff
- `POST /api/staff` — create staff member
- `PATCH /api/staff/:id` — update staff
- `DELETE /api/staff/:id` — soft deactivate (preserve booking history)
- `POST /api/staff/:id/services` — assign services to staff
- `GET /api/staff/:id/hours` — get working schedule
- `POST /api/staff/:id/hours` — set working hours
- `PATCH /api/staff/:id/hours` — update schedule
  **Holidays**
- `GET /api/holidays` — list blocked dates
- `POST /api/holidays` — add a blocked date
- `DELETE /api/holidays/:id` — remove a blocked date
  **Slots**
- `GET /api/slots?staffId=&serviceId=&date=` — returns dynamically generated available slots
  **Bookings**
- `GET /api/bookings` — list bookings with filters (today / upcoming / cancelled)
- `POST /api/bookings` — create a booking (used internally by the bot)
- `PATCH /api/bookings/:id/cancel` — cancel a booking
  **WhatsApp Webhook**
- `GET /api/webhook` — Meta webhook verification challenge
- `POST /api/webhook` — receive and route incoming WhatsApp messages

---

## Edge Cases

| Scenario                                        | How it's handled                                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Two customers book the same slot simultaneously | Prisma transaction — first write wins, second gets "slot just taken, here are remaining slots" |
| Customer sends a random message mid-flow        | Bot reads their current step from DB and re-prompts it                                         |
| Staff member deleted with active bookings       | Soft delete (isActive = false) — booking history is preserved                                  |
| Date is a holiday                               | Slot generator returns empty list — bot says "no slots available that day"                     |
| Customer says "cancel" at any point             | State resets to IDLE, customer receives a cancellation message                                 |
| Owner cancels a booking from dashboard          | Booking status → cancelled, customer receives WhatsApp notification                            |

---

## Multi-Tenancy

Every business on Bookie shares the same backend and database. Data isolation is enforced by filtering every query by `businessId` derived from the authenticated user's JWT.

The WhatsApp bot identifies which business a customer belongs to via the `bookingSlug` embedded in the QR code URL. The webhook reads this slug, resolves the `businessId`, and scopes the entire conversation to that business.

---

## QR Code & Booking Link

Each business gets a unique booking URL:

```
https://book.bookie.app/glow-salon
```

When a customer scans the QR code, WhatsApp opens with a pre-filled message sent to the business's WhatsApp number. The backend reads the slug from the message payload and starts the booking flow for that business.

---

## Dashboard Features

**Overview**

- Cards: today's bookings, upcoming bookings, active staff, total services
- Table: today's schedule
  **Bookings page**
- Filter tabs: Today / Upcoming / Cancelled
- Each row: customer name, phone, service, staff, date, time, status
- One-click cancel — sends WhatsApp notification to customer automatically
  **Services page**
- Add, edit, toggle active/inactive
  **Staff page**
- Add staff, assign services, set working hours per day
  **QR Code page**
- Display and download the business's WhatsApp booking QR code
  **Real-time updates**
- Dashboard polls bookings every 10 seconds via TanStack Query `refetchInterval`

---

## Deployment

| Service                | Platform                |
| ---------------------- | ----------------------- |
| Frontend (React)       | Vercel                  |
| Backend (Node/Express) | Railway or Render       |
| Database (PostgreSQL)  | Neon                    |
| WhatsApp               | Meta WhatsApp Cloud API |

During development, the webhook URL is exposed via ngrok. In production, the Railway URL is registered directly with Meta.

---

## Out of Scope for V1

These are intentionally deferred:

- AI-powered natural language conversations
- Online payments and subscription billing
- Customer login / account portal
- Appointment rescheduling
- Automatic reminder messages
- Google Calendar integration
- Multiple branches per business
- Multiple WhatsApp numbers per business
- Reviews, ratings, loyalty programs
- Inventory management and POS
- Marketing broadcasts
- Advanced analytics
- Multi-language support
- SMS fallback for non-WhatsApp users

---

## Success Criteria

A business owner can register, configure services, staff, working schedules, and holidays, then generate a unique QR code for customers. A customer scans the QR code, books an appointment through a guided WhatsApp conversation, and the appointment immediately appears in the business's dashboard. The platform supports multiple independent businesses using a single WhatsApp integration with complete data isolation between tenants.
