# Kalāranya Contemporary Art Studio & Atelier

> Production-grade full-stack web application built for the **GDGC Web Development Volunteer Recruitment** challenge.

Kalāranya Art Studio is a contemporary atelier dedicated to authentic Indian fine arts, architectural wall murals, and bespoke ceramic pottery. The application implements three critical business workflows with strict concurrency controls, role-based access control (RBAC), database constraints, and a restrained editorial design aesthetic.

---

## 1. Features Implemented

### A. One-of-a-Kind Painting Marketplace
- **Unique Inventory Model**: Each painting is one-of-a-kind and can be purchased only once.
- **Concurrency & Race-Condition Safeguards**: Atomic conditional update (`UPDATE Painting SET status = 'sold' WHERE id = :id AND status = 'available'`) combined with a database engine partial unique index (`idx_order_active_placed`) guarantees that concurrent buyers can never take the same painting.
- **Order Cancellation & Restoration**: Customers can cancel their own placed orders, which atomically cancels the order and restores the painting's gallery status back to `available`.
- **Catalogue & Search**: Search paintings by artist, title, or style, filter by availability, and sort by price.
- **Admin Management**: Studio admins can add new original artworks and edit details of available paintings only (editing sold paintings is strictly rejected by the server).

### B. Architectural Wall-Painting Bookings
- **Date Window Validation**: Customers select scheduled dates between **7 and 90 days** from the current date.
- **Surface Area Boundaries**: Wall sizes must be between **10 and 500 sq ft** (inclusive).
- **Server-Side Pricing**: Total cost is calculated server-side using the seed dataset rate of **₹150 / sq ft** (`wallSize * ratePerSqFt`).
- **Date Exclusivity**: Each date can be booked only once while active (`requested` or `confirmed`). Enforced via SQLite partial unique index (`idx_booking_active_date`).
- **Availability Calendar**: Live endpoint exposes reserved dates so the client calendar marks them as occupied.
- **Three-Day Cancellation Cutoff**: Customers can cancel their booking only until **3 days** before the scheduled date (`targetDate - currentDate >= 3 days`). Once inside the 3-day boundary, cancellation is locked.
- **Studio Decisions**: Admins can **confirm** or **decline** bookings. Declining or cancelling a booking immediately releases the date for new reservations.

### C. Custom Glazed Pottery Commissions
- **Seed Reference Validation**: Customers commission wheel-thrown terracotta items and mineral glazes validated against the exact seed reference data (`Kulhad`, `Surahi`, `Matka`, `Diya set`, `Gamla` with `Kumkum Red`, `Haldi Yellow`, `Mehendi Green`, `Indigo Blue`, `Sandalwood Beige`, and `Charcoal Black`).
- **Quantity & Lead Time**: Enforces quantities between **1 and 12 pieces** and a lead time of at least **14 days** in the future.
- **State Machine**: Customers may edit or cancel a commission **only while in `requested` status**. Once the studio **accepts** or **declines** the commission, customer editing/cancellation is rejected with a 400 Bad Request.

### D. Authentication & Role-Based Access Control (RBAC)
- **Two Distinct Roles**: `customer` and `studio` (admin).
- **Secure Password Hashing**: Passwords securely hashed with `bcryptjs` (salt rounds: 10).
- **Session Security**: Server-verified JWT tokens with support for both `Authorization: Bearer <token>` and `HttpOnly` cookies.
- **Strict Server-Side Enforcement**:
  - Unauthenticated access to protected routes: `401 Unauthorized`.
  - Wrong role performing restricted actions: `403 Forbidden`.
  - Customer querying or attempting to cancel another customer's record: `404 Not Found` (strict brief compliance).
- **Public Storefront**: Guests can freely browse artworks and view availability without logging in.

---

## 2. Technology Stack

- **Backend**: Node.js, Express, TypeScript, Zod request validation, Prisma ORM.
- **Database**: SQLite (Zero-dependency, turnkey execution on any clean evaluator machine) with database-engine partial unique indexes for guaranteed concurrency control.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router 6.
- **Testing**: Vitest test runner with Supertest for end-to-end HTTP and concurrency integration tests.

---

## 3. Repository Structure

```text
art-studio/
├── client/                     # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, StatusBadge, Modals, Empty/Error/Loading states
│   │   ├── context/            # AuthContext (user, role, session state)
│   │   ├── pages/              # Landing, Catalogue, Detail, WallBooking, Pottery, Dashboards
│   │   ├── services/           # API clients for auth, paintings, bookings, pottery
│   │   ├── types/              # Frontend TypeScript interfaces
│   │   ├── App.tsx             # Route definitions and role guards
│   │   └── main.tsx            # React root mount
│   ├── index.html
│   ├── tailwind.config.js      # Studio editorial color palette
│   └── package.json
├── server/                     # Express + TypeScript + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma data model definition
│   │   ├── seed.ts             # Repeatable seed script using seed.json
│   │   └── seed.json           # Actual supplied seed data
│   ├── public/
│   │   └── images/             # Seed painting image assets (p-001 to p-012)
│   ├── src/
│   │   ├── controllers/        # HTTP request/response handlers
│   │   ├── middleware/         # Auth, RBAC, Zod validation, Centralized error handler
│   │   ├── routes/             # REST route declarations
│   │   ├── services/           # Core business logic and transactions
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── lib/                # Prisma client, custom error classes, date utilities
│   │   ├── __tests__/          # Vitest + Supertest integration suite (21 passing tests)
│   │   ├── app.ts              # Express application configuration
│   │   └── index.ts            # Server entry point
│   ├── tsconfig.json
│   └── package.json
├── .env.example                # Clean configuration placeholders
├── .gitignore
├── README.md                   # Setup guide and documentation
├── DESIGN.md                   # Architectural design answers
└── package.json                # Root orchestration scripts
```

---

## 4. Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20+` recommended).
- **npm**: `v9.0.0` or higher.
- No external database installation (e.g. Postgres or Docker) is required. The project runs turnkey on SQLite via Prisma.

---

## 5. Quick Start Instructions (Clean Machine)

Clone the repository and run the automated setup command from the repository root:

```bash
# 1. Install dependencies, generate Prisma client, push schema, and seed database
npm run setup

# 2. Start the backend server (runs on http://localhost:5050)
npm run dev:server

# 3. In a separate terminal, start the frontend client (runs on http://localhost:5173)
npm run dev:client
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 6. Pre-Seeded Accounts for Evaluation

The database is pre-seeded with the exact seed credentials from `seed.json`:

| Role | Email | Password | Allowed Capabilities |
|---|---|---|---|
| **Studio Admin** | `studio@artstudio.in` | `Studio@123` | Add paintings, edit available paintings, confirm/decline wall bookings, accept/decline pottery commissions, view all studio records. |
| **Demo Customer** | `customer@example.com` | `Customer@123` | Purchase paintings, book wall dates, request custom pottery, view own orders, cancel own bookings (subject to 3-day rule). |

> **Evaluator Convenience**: On the **Sign In** screen (`/login`), click the one-click **"Studio Admin"** or **"Demo Patron"** quick-fill buttons to populate credentials instantly.

---

## 7. Running the Automated Test Suite

The test suite executes 21 automated integration tests verifying authentication, RBAC, concurrency race conditions, booking boundaries, and state transitions:

```bash
npm run test
```

### Verified Test Cases:
1. `rejects unauthenticated requests to protected endpoints with 401`
2. `rejects customer attempting admin action (add painting) with 403`
3. `rejects admin attempting customer action (buy painting) with 403`
4. `allows public access to browse paintings without login`
5. `customer can purchase an available painting`
6. `second customer purchasing same painting is rejected with 409 Conflict`
7. `concurrent purchases on a new painting allows only one winner (race condition test)`
8. `customer can cancel own order, which restores painting availability`
9. `another customer attempting to cancel someone else order receives 404`
10. `admin cannot edit a sold painting`
11. `rejects booking dates fewer than 7 days away with 400`
12. `rejects booking dates more than 90 days away with 400`
13. `rejects wall size outside 10 to 500 sq ft with 400`
14. `successfully creates booking with server-calculated price (wallSize * 150)`
15. `rejects second booking for the same date with 409 Conflict`
16. `customer can cancel booking if >= 3 days before date, freeing up the date`
17. `admin can confirm or decline a booking`
18. `rejects needed-by date fewer than 14 days away with 400`
19. `rejects invalid pottery item or glaze with 400`
20. `customer can create, edit, and cancel a request while in "requested" status`
21. `customer cannot edit or cancel an accepted request`

---

## 8. Important REST API Endpoints

### Authentication
- `POST /api/auth/register` — Customer registration
- `POST /api/auth/login` — Sign in (Customer or Studio Admin)
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Get profile for current authenticated user

### Paintings & Orders
- `GET /api/paintings` — Public painting catalogue
- `GET /api/paintings/:id` — Public painting detail
- `POST /api/paintings` — Admin only: Add new original artwork
- `PATCH /api/paintings/:id` — Admin only: Edit artwork (available paintings only)
- `POST /api/paintings/:id/orders` — Customer only: Purchase painting
- `GET /api/orders` — Order list (scoped to own for customers, all for admin)
- `POST /api/orders/:id/cancel` — Customer only: Cancel order and restore painting availability

### Wall-Painting Bookings
- `GET /api/bookings/availability` — Public: Returns list of booked dates and current mural rate
- `POST /api/bookings` — Customer only: Request booking (validates 7-90 days, 10-500 sq ft)
- `GET /api/bookings` — Scoped to own for customers, all for admin
- `POST /api/bookings/:id/confirm` — Admin only: Confirm booking
- `POST /api/bookings/:id/decline` — Admin only: Decline booking (frees up date)
- `POST /api/bookings/:id/cancel` — Customer only: Cancel booking (enforces 3-day cutoff)

### Custom Pottery Commissions
- `GET /api/pottery/options` — Returns seed pottery items and glaze options
- `POST /api/pottery/requests` — Customer only: Create request (validates items, 1-12 qty, >=14 days)
- `GET /api/pottery/requests` — Scoped to own for customers, all for admin
- `PATCH /api/pottery/requests/:id` — Customer only: Edit request (while `requested` only)
- `POST /api/pottery/requests/:id/accept` — Admin only: Accept commission
- `POST /api/pottery/requests/:id/decline` — Admin only: Decline commission
- `POST /api/pottery/requests/:id/cancel` — Customer only: Cancel request (while `requested` only)

---

## 9. Known Limitations & Deliberate Scope Exclusions

In accordance with Section 06 ("What you do not need to build") of the recruitment brief:
1. **Real Payments**: Payments are simulated; purchasing a painting creates an order without third-party payment gateways.
2. **Account Recovery**: Password reset emails and social log-ins are excluded.
3. **External Notifications**: SMS and email dispatch are not configured.
4. **File Uploads**: Admin painting image URLs reference existing gallery asset paths or standard image links rather than arbitrary multipart image uploads.
