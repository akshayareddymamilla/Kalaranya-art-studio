import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createBookingSchema } from '../validators/booking.schema';

const router = Router();

// Availability is public/accessible so customers can see dates before/during booking
router.get('/availability', BookingController.getAvailability);

// Bookings list: customer sees own, admin sees all
router.get('/', authenticate, BookingController.getAll);

// Booking detail
router.get('/:id', authenticate, BookingController.getById);

// Customer books a date
router.post(
  '/',
  authenticate,
  requireRole(['customer']),
  validateBody(createBookingSchema),
  BookingController.create
);

// Admin confirms booking
router.post(
  '/:id/confirm',
  authenticate,
  requireRole(['admin', 'studio']),
  BookingController.confirm
);

// Admin declines booking
router.post(
  '/:id/decline',
  authenticate,
  requireRole(['admin', 'studio']),
  BookingController.decline
);

// Customer cancels own booking
router.post(
  '/:id/cancel',
  authenticate,
  requireRole(['customer']),
  BookingController.cancel
);

export default router;
