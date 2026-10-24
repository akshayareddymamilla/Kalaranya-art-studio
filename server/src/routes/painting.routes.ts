import { Router } from 'express';
import { PaintingController } from '../controllers/painting.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createPaintingSchema, updatePaintingSchema } from '../validators/painting.schema';

const router = Router();

router.get('/', PaintingController.getAll);
router.get('/:id', PaintingController.getById);

// Admin only: add painting
router.post(
  '/',
  authenticate,
  requireRole(['admin', 'studio']),
  validateBody(createPaintingSchema),
  PaintingController.create
);

// Admin only: edit painting (only while available)
router.patch(
  '/:id',
  authenticate,
  requireRole(['admin', 'studio']),
  validateBody(updatePaintingSchema),
  PaintingController.update
);

// Admin only: delete painting (only while available & unpurchased)
router.delete(
  '/:id',
  authenticate,
  requireRole(['admin', 'studio']),
  PaintingController.delete
);

// Customer only: purchase painting
router.post(
  '/:id/orders',
  authenticate,
  requireRole(['customer']),
  PaintingController.purchase
);

export default router;
