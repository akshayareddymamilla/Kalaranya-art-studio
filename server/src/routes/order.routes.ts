import { Router } from 'express';
import { PaintingController } from '../controllers/painting.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Get orders: customer sees own; admin sees all
router.get('/', authenticate, PaintingController.getOrders);

// Cancel order: customer only (owning customer)
router.post(
  '/:id/cancel',
  authenticate,
  requireRole(['customer']),
  PaintingController.cancelOrder
);

export default router;
