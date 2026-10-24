import { prisma } from '../lib/prisma';
import { CreatePaintingInput, UpdatePaintingInput } from '../validators/painting.schema';
import { NotFoundError, ConflictError, BadRequestError } from '../lib/errors';

export class PaintingService {
  static async getAllPaintings() {
    return prisma.painting.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPaintingById(id: string) {
    const painting = await prisma.painting.findUnique({
      where: { id },
    });

    if (!painting) {
      throw new NotFoundError('Painting not found.');
    }

    return painting;
  }

  static async createPainting(input: CreatePaintingInput) {
    return prisma.painting.create({
      data: {
        title: input.title,
        artist: input.artist,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
        status: 'available',
      },
    });
  }

  static async updatePainting(id: string, input: UpdatePaintingInput) {
    const painting = await prisma.painting.findUnique({
      where: { id },
    });

    if (!painting) {
      throw new NotFoundError('Painting not found.');
    }

    if (painting.status !== 'available') {
      throw new BadRequestError('Cannot edit a painting that is already sold.');
    }

    return prisma.painting.update({
      where: { id },
      data: input,
    });
  }

  static async deletePainting(id: string) {
    const painting = await prisma.painting.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!painting) {
      throw new NotFoundError('Painting not found.');
    }

    if (painting.status === 'sold' || painting.orders.some((o) => o.status === 'placed')) {
      throw new BadRequestError('Cannot delete a painting that has been purchased. Active patron orders exist for this masterpiece.');
    }

    return prisma.painting.delete({
      where: { id },
    });
  }

  /**
   * Concurrency-safe purchase execution:
   * 1. Uses an atomic conditional update where status is 'available'
   * 2. Protected by database-level partial unique index idx_order_active_placed
   * 3. Prevents race conditions between concurrent buyers
   */
  static async purchasePainting(paintingId: string, customerId: string) {
    return prisma.$transaction(async (tx) => {
      // Step 1: Concurrency-safe atomic transition from available to sold
      const updated = await tx.painting.updateMany({
        where: {
          id: paintingId,
          status: 'available',
        },
        data: {
          status: 'sold',
        },
      });

      if (updated.count === 0) {
        const painting = await tx.painting.findUnique({ where: { id: paintingId } });
        if (!painting) {
          throw new NotFoundError('Painting not found.');
        }
        throw new ConflictError('This painting has already been purchased.');
      }

      const painting = await tx.painting.findUniqueOrThrow({
        where: { id: paintingId },
      });

      // Step 2: Create the active order
      const order = await tx.order.create({
        data: {
          userId: customerId,
          paintingId: painting.id,
          price: painting.price,
          status: 'placed',
        },
        include: {
          painting: true,
        },
      });

      return order;
    });
  }

  /**
   * Order cancellation:
   * 1. Owner-scoped check: Customer can only cancel their own order
   * 2. 404 response if customer tries to access another customer's order
   * 3. Atomically sets order to 'cancelled' and restores painting to 'available'
   */
  static async cancelOrder(orderId: string, customerId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { painting: true },
      });

      if (!order) {
        throw new NotFoundError('Order not found.');
      }

      // Customer privacy requirement: asking for someone else's record gets 404
      if (order.userId !== customerId) {
        throw new NotFoundError('Order not found.');
      }

      if (order.status === 'cancelled') {
        throw new BadRequestError('This order is already cancelled.');
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
        include: { painting: true },
      });

      // Restore painting availability
      await tx.painting.update({
        where: { id: order.paintingId },
        data: { status: 'available' },
      });

      return updatedOrder;
    });
  }

  /**
   * Retrieves orders:
   * If customer, scoped strictly to their own orders.
   * If admin, returns all studio orders.
   */
  static async getOrders(userId: string, isStudioAdmin: boolean) {
    if (isStudioAdmin) {
      return prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          painting: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    }

    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        painting: true,
      },
    });
  }
}
