import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * Initializes database-level partial unique indexes in SQLite.
 * This ensures strict concurrency safety at the database engine level:
 * 1. A painting can only have ONE order with status = 'placed'.
 * 2. A date can only have ONE booking with status in ('requested', 'confirmed').
 */
export async function ensureDatabaseConstraints(): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_order_active_placed 
      ON "Order"("paintingId") 
      WHERE "status" = 'placed';
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_active_date 
      ON "Booking"("date") 
      WHERE "status" IN ('requested', 'confirmed');
    `);
  } catch (error) {
    console.error('Failed to create partial unique indexes:', error);
  }
}
