# 5-Minute Demo Video Script & Walkthrough Guide
## GDGC Web Development Volunteer Recruitment Evaluation

This script is structured to stay strictly within the **5-minute limit** required by Section 05 of the recruitment brief. Use your own voice, record your screen, upload the video to **Google Drive**, and set access to **"Anyone with the link can view"**.

---

## ⏱️ Video Timeline & Teleprompter

### 1. Introduction & Overview (0:00 – 0:40)
- **Screen:** Open the home page at [`http://localhost:5173`](http://localhost:5173).
- **Action:** Scroll smoothly past the hero section, highlighting the 3 core disciplines (Original Paintings, Architectural Murals, Custom Pottery).
- **What to say:**
  > *"Hello! I'm presenting the Kalāranya Art Studio application built for the GDGC Web Development Volunteer Recruitment challenge. The studio fulfills three distinct business offerings: selling one-of-a-kind fine art paintings, booking architectural wall murals, and commissioning custom glazed pottery. It implements two distinct roles: Customer and Studio Admin, with complete server-side role-based access control, database concurrency protection, and the exact provided seed dataset."*

---

### 2. Customer Journey: Sign-Up & Buying a Painting (0:41 – 1:35)
- **Screen:** Click **"Register"** in the top navigation bar (`/register`).
- **Action:**
  1. Fill in name: `Arjun Verma`, email: `arjun@example.com`, password: `Password@123`.
  2. Click **"Register Account"**. Show immediate successful registration and automatic sign-in leading to the customer workspace.
  3. Click **"Paintings"** in the navigation bar.
  4. Point out an available painting (e.g. *Madhubani Peacock Garden* or *Warli Village Scene*).
  5. Click **"Buy"** -> Confirm the purchase in the modal dialog.
  6. Show the green success notification banner and the status badge immediately flipping from *Available* to *Sold*.
- **What to say:**
  > *"To show customer onboarding as required by the brief, I will register a new customer account. The backend validates the inputs, hashes the password using bcrypt, and issues an authenticated session. Now browsing the gallery catalogue, each painting here is one-of-a-kind and can be bought only once. I'll acquire this available piece. When I confirm, an order is placed on the backend, and the painting is atomically marked as sold so no other user can purchase it concurrently."*

---

### 3. Order Management & Availability Restoration (1:36 – 2:20)
- **Screen:** Click **"My Dashboard"** -> **"My Painting Orders"** tab.
- **Action:**
  1. Show the placed order in the table with its thumbnail, price, and status badge.
  2. *(Optional standout feature)*: Click **"Certificate"** to show the generated archival Certificate of Authenticity.
  3. Click **"Cancel Order"** -> Confirm cancellation in the modal.
  4. Navigate back to **"Paintings"** to show that the painting has returned to *Available* in the gallery.
- **What to say:**
  > *"In the customer dashboard under 'My Orders', I can see my active acquisition. Here I can view its verified Certificate of Authenticity. To demonstrate the business rule from the brief: if I cancel this order, the backend transaction cancels the order record and atomically restores the painting's availability in the gallery catalogue."*

---

### 4. Wall Mural Booking & Server Pricing (2:21 – 3:05)
- **Screen:** Click **"Wall Murals"** (`/book-wall`).
- **Action:**
  1. Select a scheduled date within the 7 to 90 day window.
  2. Move the wall area slider to **80 sq ft** (between 10 and 500 sq ft).
  3. Point out the live price calculation: `80 sq ft × ₹150 / sq ft = ₹12,000`.
  4. Enter a site address and click **"Submit Booking Request"**.
  5. Show the reserved date appear in the *"Already Booked Dates"* indicator list.
- **What to say:**
  > *"Next is the wall-painting booking. The client selects a scheduled date between 7 and 90 days out, and specifies a wall size between 10 and 500 square feet. The rate of ₹150 per square foot is loaded directly from the seed dataset and calculated server-side. Each date is exclusively reserved—if another customer attempts to book this same date, the database enforces partial uniqueness and rejects it with a conflict error."*

---

### 5. Custom Pottery Commission (3:06 – 3:45)
- **Screen:** Click **"Custom Pottery"** (`/custom-pottery`).
- **Action:**
  1. Select an item from seed data (e.g. *Surahi (water jug)*).
  2. Select an artisanal glaze (e.g. *Haldi Yellow*).
  3. Set quantity to 4 (between 1 and 12).
  4. Pick a needed-by date at least 14 days in the future.
  5. Submit the commission request.
  6. Go to **"My Dashboard"** -> **"Custom Pottery"** tab and briefly show the **"Edit"** and **"Cancel"** options while in `requested` status.
- **What to say:**
  > *"For custom pottery, the customer selects authentic items and mineral glazes from the supplied seed dataset. The system validates quantity between 1 and 12, and ensures a lead time of at least 14 days for kiln firing. In the customer atelier, the patron has the right to edit or cancel this request while it remains in 'requested' status."*

---

### 6. Studio Admin Console Decisions (3:46 – 4:25)
- **Screen:** Sign out -> Sign in as **"Studio Admin"** (`studio@artstudio.in` / `Studio@123`).
- **Action:**
  1. Click **"Studio Admin"** console (`/admin`).
  2. Highlight the overview metrics (available paintings, active mural requests, pending pottery).
  3. Under **"Wall Mural Bookings"**, click **"Confirm"** on the customer booking.
  4. Under **"Pottery Commissions"**, click **"Accept"** on the custom pottery request.
  5. Under **"Paintings"**, show that available paintings have an **"Edit Artwork"** button, while sold paintings display a locked disabled label.
- **What to say:**
  > *"Now logging in as the Studio Administrator. The admin workspace provides an overview of all studio operations. Here under Wall Bookings, I review the customer's request and click 'Confirm'. Under Pottery Commissions, I click 'Accept', which locks the commission from customer modifications. In the Paintings tab, the studio can add new artworks, but editing is strictly prohibited on sold paintings."*

---

### 7. Code Architecture Walkthrough (4:26 – 5:00)
- **Screen:** Switch to your code editor (VS Code / IDE).
- **File to show:** [`server/src/services/painting.service.ts`](file:///d:/Random/art-studio/server/src/services/painting.service.ts) (Lines 61–95) and [`server/src/lib/prisma.ts`](file:///d:/Random/art-studio/server/src/lib/prisma.ts) (Lines 10–25).
- **Action:** Scroll to `purchasePainting` and point to the atomic conditional update and the partial unique index.
- **What to say:**
  > *"Finally, here is the backend implementation in TypeScript and Prisma. To stop two people from taking the same painting concurrently, we execute an atomic conditional update where status must equal 'available'. If two concurrent buyers hit the endpoint simultaneously, only one transaction updates the row; the other receives zero modified rows and is aborted with a 409 Conflict. On top of that, we enforce a database-level partial unique index so two active orders can never exist physically. All 21 integration tests pass cleanly. Thank you for your time and evaluation!"*

---

## 🎙️ Recording Checklist Before You Record:
1. Ensure both servers are running (`npm run dev:server` on port 5050 and `npm run dev:client` on port 5173).
2. Reset the database to clean seed state:
   ```bash
   cd server
   npm run seed
   ```
3. Close extra browser tabs and notifications.
4. Record at 1080p using OBS Studio, Windows Game Bar (`Win + G`), or Loom.
5. Keep your tone confident, clear, and focused on **reliability, business rules, and concurrency safeguards**.
6. After recording, upload to Google Drive and verify: **General access -> Anyone with the link (Viewer)**.
