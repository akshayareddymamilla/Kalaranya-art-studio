# DESIGN.md — Technical Architecture & Implementation Decisions

## 1. How do login and the two roles work?

Authentication is powered by bcrypt-hashed passwords and JSON Web Tokens (JWT) verified on every protected HTTP request via middleware. When a user logs in (`POST /api/auth/login`), the server issues a signed JWT containing their user ID, email, name, and role (`customer` or `studio`/`admin`). This token is returned in the response body for bearer authorization headers and also set as a secure `HttpOnly` cookie. 

Authorization is enforced entirely on the server through two middlewares: `authenticate` (which rejects unauthenticated requests with `401 Unauthorized`) and `requireRole` (which rejects unauthorized access with `403 Forbidden`, such as customers attempting to add paintings or admins attempting to purchase items). For owner-scoped resources (orders, bookings, pottery requests), customer queries are strictly scoped using `where: { userId: req.user.id }`. In strict accordance with the recruitment specification, if a customer attempts to access, edit, or cancel a record belonging to another customer, the server responds with `404 Not Found`.

---

## 2. Which database did you choose, and why?

We chose **SQLite** managed via **Prisma ORM**. 

We selected SQLite because the recruitment brief explicitly states: *"Database: Your choice. A small app that works beats a large one that breaks."* SQLite allows zero-dependency, turnkey execution on any evaluator's clean machine without requiring Docker containers, external PostgreSQL service credentials, network latency, or database daemon configurations. At the same time, SQLite provides full ACID transactions, relational foreign keys, cascade deletes, and native support for partial unique indexes (`CREATE UNIQUE INDEX ... WHERE status IN (...)`). This gives us enterprise-grade relational integrity with zero friction. Switching to PostgreSQL in production would simply involve changing `provider = "postgresql"` in `prisma/schema.prisma` without rewriting application code.

---

## 3. How do you stop two people from taking the same painting or date?

We enforce concurrency safety at two layers: **atomic conditional database updates** and **database-engine partial unique indexes**.

1. **For Paintings**:
   - In `PaintingService.purchasePainting`, we perform an atomic conditional update inside an interactive database transaction:
     ```typescript
     const updated = await tx.painting.updateMany({
       where: { id: paintingId, status: 'available' },
       data: { status: 'sold' },
     });
     if (updated.count === 0) throw new ConflictError('This painting has already been purchased.');
     ```
   - Only the first transaction finds `status: 'available'` and changes it to `'sold'` (`count === 1`). Any concurrent transaction running simultaneously finds `count === 0` and is immediately aborted with a `409 Conflict`.
   - In addition, SQLite enforces a partial unique index:
     ```sql
     CREATE UNIQUE INDEX IF NOT EXISTS idx_order_active_placed ON "Order"("paintingId") WHERE "status" = 'placed';
     ```
     This physically prevents more than one active `placed` order from ever existing for the same painting.

2. **For Wall-Painting Dates**:
   - We check active bookings and wrap creation in a database transaction.
   - Crucially, we enforce a database-level partial unique index:
     ```sql
     CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_active_date ON "Booking"("date") WHERE "status" IN ('requested', 'confirmed');
     ```
   - If two patrons attempt to submit bookings for the same date at the exact same millisecond, the database engine guarantees that only one transaction commits; the other triggers a unique constraint violation that our centralized error handler translates into a clean `409 Conflict` ("This date has already been booked"). When a booking is `declined` or `cancelled`, the date falls out of the partial index filter and is immediately freed for new reservations.

---

## 4. What did you finish, what did you leave out, and what would you do next?

### What Was Finished:
- **All Three Core Workflows**:
  - One-of-a-kind painting marketplace with concurrency-safe purchasing, customer order cancellation, availability restoration, and admin painting creation/editing.
  - Wall-painting booking with the 7–90 day scheduling window, 10–500 sq ft size validation, server-side pricing from seed rate (₹150/sq ft), date exclusivity, 3-day cancellation cutoff enforcement, and admin confirm/decline controls.
  - Custom pottery commissioning with actual seed items and glazes, 1–12 quantity limits, 14-day lead time validation, customer edit/cancellation while requested, and admin accept/decline controls.
- **Role-Based Access Control**: Complete RBAC with 401, 403, and 404 enforcement.
- **Frontend Experience**: Editorial, contemporary art studio aesthetic with dedicated customer and admin dashboards, loading states, empty states, error cards, confirmation dialogs, and conflict banners.
- **Verification**: Complete automated test suite with 21 passing Vitest + Supertest integration tests.

### What Was Deliberately Left Out (Brief Scope Exclusions):
- Real payment gateway integrations (Razorpay/Stripe); orders are placed directly without third-party payments.
- Password reset, email verification, social OAuth logins, and public admin registration.
- SMS and email notification services.
- Arbitrary multipart image uploads (paintings reference studio gallery paths).

### What I Would Do Next:
- Add WebSocket or SSE (Server-Sent Events) live updates so that if another patron acquires a painting, all other open browser sessions instantly see the "Sold" badge update in real time without refreshing.
- Add an interactive visual wall-dimension simulator in the mural booking flow to help customers preview mural proportions.
- Implement automated automated smoke test suites using Playwright for full end-to-end browser walkthroughs.
