import { z } from 'zod';

export const createBookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  wallSize: z.number().int().min(10, 'Wall size must be at least 10 sq ft').max(500, 'Wall size cannot exceed 500 sq ft'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
