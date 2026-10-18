import { Router } from 'express';
import { PotteryController } from '../controllers/pottery.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createPotteryRequestSchema, updatePotteryRequestSchema } from '../validators/pottery.schema';

const router = Router();

// Options endpoint: items and glazes for custom requests
router.get('/options', PotteryController.getOptions);

// List requests: customer sees own, admin sees all
router.get('/requests', authenticate, PotteryController.getAll);

// Get single request
router.get('/requests/:id', authenticate, PotteryController.getById);

// Customer creates request
router.post(
  '/requests',
  authenticate,
  requireRole(['customer']),
  validateBody(createPotteryRequestSchema),
  PotteryController.create
);

// Customer edits request (only while 'requested')
router.patch(
  '/requests/:id',
  authenticate,
  requireRole(['customer']),
  validateBody(updatePotteryRequestSchema),
  PotteryController.update
);

// Admin accepts request
router.post(
  '/requests/:id/accept',
  authenticate,
  requireRole(['admin', 'studio']),
  PotteryController.accept
);

// Admin declines request
router.post(
  '/requests/:id/decline',
  authenticate,
  requireRole(['admin', 'studio']),
  PotteryController.decline
);

// Customer cancels request (only while 'requested')
router.post(
  '/requests/:id/cancel',
  authenticate,
  requireRole(['customer']),
  PotteryController.cancel
);

export default router;
