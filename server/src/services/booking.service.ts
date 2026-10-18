import { prisma } from '../lib/prisma';
import { CreateBookingInput } from '../validators/booking.schema';
import { isBookingDateValid, canCancelBooking } from '../lib/date-utils';
import { BadRequestError, ConflictError, NotFoundError } from '../lib/errors';

export class BookingService {
  /**
   * Fetches all booked dates currently occupying the calendar (requested or confirmed).
   * Releases dates if cancelled or declined.
   */
  static async getOccupiedDates(): Promise<string[]> {
    const activeBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['requested', 'confirmed'] },
      },
      select: { date: true },
    });

    return activeBookings.map((b) => b.date);
  }

  /**
   * Gets mural rate per sq ft configured in the database from seed data.
   */
  static async getRatePerSqFt(): Promise<number> {
    const setting = await prisma.studioSetting.findUnique({
      where: { key: 'mural_rate_per_sq_ft' },
    });
    return setting ? parseInt(setting.value, 10) : 150;
  }

  /**
   * Creates a wall painting booking:
   * 1. Validates date window (7-90 days from today)
   * 2. Checks active date conflicts (requested/confirmed)
   * 3. Calculates price on the server: wallSize * ratePerSqFt
   * 4. Enforces concurrency via database transaction & partial unique index
   */
  static async createBooking(userId: string, input: CreateBookingInput) {
    // 1. Date window validation
    const dateCheck = isBookingDateValid(input.date);
    if (!dateCheck.valid) {
      throw new BadRequestError(dateCheck.reason || 'Invalid booking date.');
    }

    const rate = await this.getRatePerSqFt();
    const totalPrice = input.wallSize * rate;

    // Concurrency-safe atomic transaction
    return prisma.$transaction(async (tx) => {
      // Check existing active booking for this date
      const existing = await tx.booking.findFirst({
        where: {
          date: input.date,
          status: { in: ['requested', 'confirmed'] },
        },
      });

      if (existing) {
        throw new ConflictError('This date has already been booked.');
      }

      const booking = await tx.booking.create({
        data: {
          userId,
          date: input.date,
          wallSize: input.wallSize,
          ratePerSqFt: rate,
          totalPrice,
          address: input.address,
          status: 'requested',
        },
      });

      return booking;
    });
  }

  /**
   * Customer booking cancellation:
   * 1. Must own the booking (or 404)
   * 2. Status cannot be cancelled or declined
   * 3. Must be at least 3 days before the booking date
   */
  static async cancelBooking(bookingId: string, customerId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found.');
    }

    if (booking.userId !== customerId) {
      throw new NotFoundError('Booking not found.');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestError('This booking is already cancelled.');
    }

    if (booking.status === 'declined') {
      throw new BadRequestError('Cannot cancel a declined booking.');
    }

    // Check 3-day cutoff rule
    if (!canCancelBooking(booking.date)) {
      throw new BadRequestError('Bookings can only be cancelled at least 3 days before the scheduled date.');
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
    });
  }

  /**
   * Admin confirms booking:
   * Transitions status to 'confirmed'.
   */
  static async confirmBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found.');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestError('Cannot confirm a cancelled booking.');
    }

    if (booking.status === 'confirmed') {
      return booking; // Idempotent
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed' },
    });
  }

  /**
   * Admin declines booking:
   * Transitions status to 'declined', freeing up the date.
   */
  static async declineBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found.');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestError('Cannot decline a cancelled booking.');
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'declined' },
    });
  }

  /**
   * Retrieves bookings:
   * If customer, scoped strictly to their own bookings.
   * If admin, returns all bookings with user details.
   */
  static async getBookings(userId: string, isStudioAdmin: boolean) {
    if (isStudioAdmin) {
      return prisma.booking.findMany({
        orderBy: { date: 'asc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    }

    return prisma.booking.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }

  static async getBookingById(bookingId: string, userId: string, isStudioAdmin: boolean) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking not found.');
    }

    if (!isStudioAdmin && booking.userId !== userId) {
      throw new NotFoundError('Booking not found.');
    }

    return booking;
  }
}
