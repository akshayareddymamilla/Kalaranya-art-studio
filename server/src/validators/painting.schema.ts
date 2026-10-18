import { z } from 'zod';

export const createPaintingSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  artist: z.string().min(2, 'Artist must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.number().int().positive('Price must be a positive integer in INR'),
  imageUrl: z.string().min(1, 'Image URL or path is required'),
});

export const updatePaintingSchema = createPaintingSchema.partial();

export type CreatePaintingInput = z.infer<typeof createPaintingSchema>;
export type UpdatePaintingInput = z.infer<typeof updatePaintingSchema>;
