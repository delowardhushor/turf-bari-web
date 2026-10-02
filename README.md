# TurfBari web

Customer site for TurfBari. Next.js 16 (App Router), Tailwind v4, English and Bangla.

## Run

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL -> backend, e.g. http://localhost:5002/api/v1
npm install
npm run dev                  # http://localhost:3000
```

The backend must run against a MongoDB **replica set** (bookings use transactions).
Turf owners and staff use the separate `console/` app; they are pointed there if they sign in here.

## Screens

| Route | What it does | Backend |
| --- | --- | --- |
| `/` | Landing page, quick search, featured turfs | `GET /grounds` |
| `/turfs` | Search by date, sport and time window (filters live in the URL) | `GET /grounds/search` |
| `/turfs/[id]` | Turf details, price table, offers, pick a slot and book | `GET /grounds/:id`, `GET /slots`, `POST /bookings` |
| `/bookings` | My bookings: upcoming / past / cancelled | `GET /bookings` |
| `/bookings/[id]` | Booking details | `GET /bookings/:id` |
| `/login`, `/signup` | Email or phone; returns to `?next=` | `/auth/login/*`, `/auth/signup/*` |
| `/forgot-password` | Request a code, then set a new password | `/auth/forgot-password`, `/auth/reset-password` |
| `/account` | Edit name, change password, sign out | `/users/:id`, `/auth/change-password` |
| `/contact`, `/about`, `/faq` | Static info | none |

## Layout

```
app/          routes (server wrappers that set metadata, rendering client views)
components/   ui/ primitives, layout/, auth/, turf/, bookings/, account/, pages/
contexts/     Auth (session in localStorage), Language (en/bn)
hooks/        useAsync, useNow, useSports
services/     api client + auth / grounds / bookings calls
utils/        formatting, dates, redirects
dictionaries/ en.json, bn.json (keep keys identical)
```

Notes: dates and times are plain local strings (never UTC); the API doesn't hide slots that already
started, so the UI does. Customers cannot cancel yet (no customer cancel endpoint).
