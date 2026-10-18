import { z } from 'zod';

export const createPotteryRequestSchema = z.object({
  itemId: z.string().min(1, 'Item selection is required'),
  glazeId: z.string().min(1, 'Glaze selection is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(12, 'Quantity cannot exceed 12'),
  neededByDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  notes: z.string().optional(),
});

export const updatePotteryRequestSchema = createPotteryRequestSchema.partial();

export type CreatePotteryRequestInput = z.infer<typeof createPotteryRequestSchema>;
export type UpdatePotteryRequestInput = z.infer<typeof updatePotteryRequestSchema>;
