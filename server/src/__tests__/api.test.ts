import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma, ensureDatabaseConstraints } from '../lib/prisma';
import bcrypt from 'bcryptjs';

let customerToken: string;
let customerId: string;
let customer2Token: string;
let customer2Id: string;
let adminToken: string;

beforeAll(async () => {
  await ensureDatabaseConstraints();

  // Create or clean test users
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.potteryRequest.deleteMany();
  await prisma.user.deleteMany({
    where: {
      email: { in: ['test-cust1@example.com', 'test-cust2@example.com', 'test-admin@example.com'] },
    },
  });

  const pwd = await bcrypt.hash('Password@123', 10);

  const c1 = await prisma.user.create({
    data: {
      email: 'test-cust1@example.com',
      password: pwd,
      name: 'Test Customer One',
      role: 'customer',
    },
  });
  customerId = c1.id;

  const c2 = await prisma.user.create({
    data: {
      email: 'test-cust2@example.com',
      password: pwd,
      name: 'Test Customer Two',
      role: 'customer',
    },
  });
  customer2Id = c2.id;

  const adm = await prisma.user.create({
    data: {
      email: 'test-admin@example.com',
      password: pwd,
      name: 'Test Admin',
      role: 'studio',
    },
  });

  // Log in to get tokens
  const res1 = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test-cust1@example.com', password: 'Password@123' });
  customerToken = res1.body.data.token;

  const res2 = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test-cust2@example.com', password: 'Password@123' });
  customer2Token = res2.body.data.token;

  const resAdm = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test-admin@example.com', password: 'Password@123' });
  adminToken = resAdm.body.data.token;

  // Ensure reference items exist
  await prisma.studioSetting.upsert({
    where: { key: 'mural_rate_per_sq_ft' },
    update: { value: '150' },
    create: { key: 'mural_rate_per_sq_ft', value: '150' },
  });

  await prisma.potteryItem.upsert({
    where: { id: 'i-01' },
    update: { name: 'Kulhad (clay cup)' },
    create: { id: 'i-01', name: 'Kulhad (clay cup)' },
  });

  await prisma.glaze.upsert({
    where: { id: 'g-01' },
    update: { name: 'Kumkum Red' },
    create: { id: 'g-01', name: 'Kumkum Red' },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('1. Authentication & RBAC', () => {
  it('rejects unauthenticated requests to protected endpoints with 401', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects customer attempting admin action (add painting) with 403', async () => {
    const res = await request(app)
      .post('/api/paintings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        title: 'Unauthorized Painting',
        artist: 'Hacker',
        description: 'Should fail',
        price: 1000,
        imageUrl: 'images/test.jpg',
      });
    expect(res.status).toBe(403);
  });

  it('rejects admin attempting customer action (buy painting) with 403', async () => {
    const res = await request(app)
      .post('/api/paintings/p-001/orders')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(403);
  });

  it('allows public access to browse paintings without login', async () => {
    const res = await request(app).get('/api/paintings');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('2. Paintings & Concurrency Protection', () => {
  let testPaintingId: string;
  let concurrentPaintingId: string;

  beforeAll(async () => {
    const p = await prisma.painting.create({
      data: {
        title: 'Sunset in Varanasi',
        artist: 'Ananya Roy',
        description: 'Vibrant acrylic on stretched linen canvas',
        price: 8500,
        imageUrl: 'images/p-001.jpg',
        status: 'available',
      },
    });
    testPaintingId = p.id;
  });

  afterAll(async () => {
    const ids = [testPaintingId, concurrentPaintingId].filter(Boolean);
    if (ids.length > 0) {
      await prisma.order.deleteMany({ where: { paintingId: { in: ids } } });
      await prisma.painting.deleteMany({ where: { id: { in: ids } } });
    }
  });

  it('customer can purchase an available painting', async () => {
    const res = await request(app)
      .post(`/api/paintings/${testPaintingId}/orders`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.painting.status).toBe('sold');
    expect(res.body.data.status).toBe('placed');
  });

  it('second customer purchasing same painting is rejected with 409 Conflict', async () => {
    const res = await request(app)
      .post(`/api/paintings/${testPaintingId}/orders`)
      .set('Authorization', `Bearer ${customer2Token}`);

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already been purchased');
  });

  it('concurrent purchases on a new painting allows only one winner', async () => {
    const concurrentPainting = await prisma.painting.create({
      data: {
        title: 'Desert Mirage',
        artist: 'Vikram Seth',
        description: 'Oil on wood panel',
        price: 12000,
        imageUrl: 'images/p-002.jpg',
        status: 'available',
      },
    });
    concurrentPaintingId = concurrentPainting.id;

    const [resA, resB] = await Promise.all([
      request(app)
        .post(`/api/paintings/${concurrentPainting.id}/orders`)
        .set('Authorization', `Bearer ${customerToken}`),
      request(app)
        .post(`/api/paintings/${concurrentPainting.id}/orders`)
        .set('Authorization', `Bearer ${customer2Token}`),
    ]);

    const statuses = [resA.status, resB.status];
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);

    // Only 1 order exists
    const orders = await prisma.order.findMany({
      where: { paintingId: concurrentPainting.id, status: 'placed' },
    });
    expect(orders.length).toBe(1);
  });

  it('customer can cancel own order, which restores painting availability', async () => {
    // Find customer 1's order for testPaintingId
    const order = await prisma.order.findFirstOrThrow({
      where: { paintingId: testPaintingId, status: 'placed' },
    });

    const res = await request(app)
      .post(`/api/orders/${order.id}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('cancelled');

    // Verify painting is back to 'available'
    const painting = await prisma.painting.findUniqueOrThrow({ where: { id: testPaintingId } });
    expect(painting.status).toBe('available');
  });

  it('another customer attempting to cancel someone else order receives 404', async () => {
    // Customer 1 purchases again
    const purchaseRes = await request(app)
      .post(`/api/paintings/${testPaintingId}/orders`)
      .set('Authorization', `Bearer ${customerToken}`);
    const orderId = purchaseRes.body.data.id;

    // Customer 2 tries to cancel customer 1's order
    const cancelRes = await request(app)
      .post(`/api/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${customer2Token}`);

    expect(cancelRes.status).toBe(404);
  });

  it('admin cannot edit a sold painting', async () => {
    const res = await request(app)
      .patch(`/api/paintings/${testPaintingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'New Illegal Title' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Cannot edit a painting that is already sold');
  });
});

describe('3. Wall-Painting Bookings', () => {
  // Helper to get formatted date string offset from today
  function getDateOffset(daysAhead: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  it('rejects booking dates fewer than 7 days away with 400', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date: getDateOffset(4),
        wallSize: 100,
        address: '123 Art Lane, Bangalore',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 7 days');
  });

  it('rejects booking dates more than 90 days away with 400', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date: getDateOffset(95),
        wallSize: 100,
        address: '123 Art Lane, Bangalore',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('90 days');
  });

  it('rejects wall size outside 10 to 500 sq ft with 400', async () => {
    const resSmall = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date: getDateOffset(15),
        wallSize: 5,
        address: '123 Art Lane, Bangalore',
      });
    expect(resSmall.status).toBe(400);

    const resLarge = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date: getDateOffset(15),
        wallSize: 600,
        address: '123 Art Lane, Bangalore',
      });
    expect(resLarge.status).toBe(400);
  });

  it('successfully creates booking with server-calculated price (wallSize * 150)', async () => {
    const date = getDateOffset(20);
    const wallSize = 80;

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date,
        wallSize,
        address: '42 Gallery Road, Hyderabad',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.totalPrice).toBe(80 * 150);
    expect(res.body.data.ratePerSqFt).toBe(150);
    expect(res.body.data.status).toBe('requested');
  });

  it('rejects second booking for the same date with 409 Conflict', async () => {
    const date = getDateOffset(20);

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        date,
        wallSize: 50,
        address: '99 Studio Avenue, Delhi',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already been booked');
  });

  it('customer can cancel booking if >= 3 days before date, freeing up the date', async () => {
    const date = getDateOffset(25);
    const createRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date,
        wallSize: 60,
        address: '10 Artisan St, Mumbai',
      });
    const bookingId = createRes.body.data.id;

    // Cancel booking
    const cancelRes = await request(app)
      .post(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe('cancelled');

    // Date is now free: customer 2 can book it
    const rebookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customer2Token}`)
      .send({
        date,
        wallSize: 100,
        address: '10 Artisan St, Mumbai',
      });
    expect(rebookRes.status).toBe(201);
  });

  it('admin can confirm or decline a booking', async () => {
    const date = getDateOffset(30);
    const createRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        date,
        wallSize: 120,
        address: 'Studio Hub, Chennai',
      });
    const bookingId = createRes.body.data.id;

    const confirmRes = await request(app)
      .post(`/api/bookings/${bookingId}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.status).toBe('confirmed');

    const declineRes = await request(app)
      .post(`/api/bookings/${bookingId}/decline`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(declineRes.status).toBe(200);
    expect(declineRes.body.data.status).toBe('declined');
  });
});

describe('4. Custom Pottery Requests', () => {
  function getDateOffset(daysAhead: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  it('rejects needed-by date fewer than 14 days away with 400', async () => {
    const res = await request(app)
      .post('/api/pottery/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        itemId: 'i-01',
        glazeId: 'g-01',
        quantity: 4,
        neededByDate: getDateOffset(7),
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 14 days');
  });

  it('rejects invalid pottery item or glaze with 400', async () => {
    const res = await request(app)
      .post('/api/pottery/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        itemId: 'invalid-item',
        glazeId: 'g-01',
        quantity: 2,
        neededByDate: getDateOffset(20),
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid pottery item');
  });

  it('customer can create, edit, and cancel a request while in "requested" status', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/pottery/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        itemId: 'i-01',
        glazeId: 'g-01',
        quantity: 3,
        neededByDate: getDateOffset(21),
        notes: 'Handle with extra care',
      });

    expect(createRes.status).toBe(201);
    const reqId = createRes.body.data.id;

    // Edit
    const editRes = await request(app)
      .patch(`/api/pottery/requests/${reqId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 6 });

    expect(editRes.status).toBe(200);
    expect(editRes.body.data.quantity).toBe(6);

    // Cancel
    const cancelRes = await request(app)
      .post(`/api/pottery/requests/${reqId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.data.status).toBe('cancelled');
  });

  it('customer cannot edit or cancel an accepted request', async () => {
    const createRes = await request(app)
      .post('/api/pottery/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        itemId: 'i-01',
        glazeId: 'g-01',
        quantity: 2,
        neededByDate: getDateOffset(22),
      });
    const reqId = createRes.body.data.id;

    // Admin accepts
    await request(app)
      .post(`/api/pottery/requests/${reqId}/accept`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Customer tries to edit
    const editRes = await request(app)
      .patch(`/api/pottery/requests/${reqId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ quantity: 5 });
    expect(editRes.status).toBe(400);

    // Customer tries to cancel
    const cancelRes = await request(app)
      .post(`/api/pottery/requests/${reqId}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(cancelRes.status).toBe(400);
  });
});
