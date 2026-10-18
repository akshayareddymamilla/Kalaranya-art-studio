import { prisma } from '../lib/prisma';
import { CreatePotteryRequestInput, UpdatePotteryRequestInput } from '../validators/pottery.schema';
import { isPotteryDateValid } from '../lib/date-utils';
import { BadRequestError, NotFoundError } from '../lib/errors';

export class PotteryService {
  /**
   * Returns available pottery items and glazes for form dropdowns.
   */
  static async getOptions() {
    const [items, glazes] = await Promise.all([
      prisma.potteryItem.findMany({ orderBy: { id: 'asc' } }),
      prisma.glaze.findMany({ orderBy: { id: 'asc' } }),
    ]);

    return { items, glazes };
  }

  /**
   * Creates a custom pottery request:
   * 1. Validates itemId and glazeId exist in seed database
   * 2. Validates neededByDate is at least 14 days in future
   * 3. Sets initial status to 'requested'
   */
  static async createRequest(userId: string, input: CreatePotteryRequestInput) {
    // 1. Verify item exists
    const item = await prisma.potteryItem.findUnique({
      where: { id: input.itemId },
    });
    if (!item) {
      throw new BadRequestError(`Invalid pottery item ID: "${input.itemId}"`);
    }

    // 2. Verify glaze exists
    const glaze = await prisma.glaze.findUnique({
      where: { id: input.glazeId },
    });
    if (!glaze) {
      throw new BadRequestError(`Invalid glaze ID: "${input.glazeId}"`);
    }

    // 3. Verify date window
    const dateCheck = isPotteryDateValid(input.neededByDate);
    if (!dateCheck.valid) {
      throw new BadRequestError(dateCheck.reason || 'Needed-by date must be at least 14 days away.');
    }

    return prisma.potteryRequest.create({
      data: {
        userId,
        itemId: input.itemId,
        glazeId: input.glazeId,
        quantity: input.quantity,
        neededByDate: input.neededByDate,
        notes: input.notes,
        status: 'requested',
      },
      include: {
        item: true,
        glaze: true,
      },
    });
  }

  /**
   * Edit a pottery request:
   * Only allowed while status is 'requested' and owner matches.
   */
  static async updateRequest(requestId: string, customerId: string, input: UpdatePotteryRequestInput) {
    const request = await prisma.potteryRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.userId !== customerId) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.status !== 'requested') {
      throw new BadRequestError(`Cannot edit request because it has already been ${request.status}.`);
    }

    // If itemId provided, verify
    if (input.itemId) {
      const item = await prisma.potteryItem.findUnique({ where: { id: input.itemId } });
      if (!item) throw new BadRequestError(`Invalid pottery item ID: "${input.itemId}"`);
    }

    // If glazeId provided, verify
    if (input.glazeId) {
      const glaze = await prisma.glaze.findUnique({ where: { id: input.glazeId } });
      if (!glaze) throw new BadRequestError(`Invalid glaze ID: "${input.glazeId}"`);
    }

    // If neededByDate provided, verify
    if (input.neededByDate) {
      const dateCheck = isPotteryDateValid(input.neededByDate);
      if (!dateCheck.valid) {
        throw new BadRequestError(dateCheck.reason || 'Needed-by date must be at least 14 days away.');
      }
    }

    return prisma.potteryRequest.update({
      where: { id: requestId },
      data: input,
      include: {
        item: true,
        glaze: true,
      },
    });
  }

  /**
   * Cancel a pottery request:
   * Only allowed while status is 'requested' and owner matches.
   */
  static async cancelRequest(requestId: string, customerId: string) {
    const request = await prisma.potteryRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.userId !== customerId) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.status !== 'requested') {
      throw new BadRequestError(`Cannot cancel request because it has already been ${request.status}.`);
    }

    return prisma.potteryRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' },
      include: {
        item: true,
        glaze: true,
      },
    });
  }

  /**
   * Admin accepts request:
   * Transitions status to 'accepted'.
   */
  static async acceptRequest(requestId: string) {
    const request = await prisma.potteryRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.status === 'cancelled') {
      throw new BadRequestError('Cannot accept a cancelled request.');
    }

    return prisma.potteryRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
      include: {
        item: true,
        glaze: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Admin declines request:
   * Transitions status to 'declined'.
   */
  static async declineRequest(requestId: string) {
    const request = await prisma.potteryRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (request.status === 'cancelled') {
      throw new BadRequestError('Cannot decline a cancelled request.');
    }

    return prisma.potteryRequest.update({
      where: { id: requestId },
      data: { status: 'declined' },
      include: {
        item: true,
        glaze: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Retrieves pottery requests:
   * If customer, scoped to own requests.
   * If admin, returns all requests.
   */
  static async getRequests(userId: string, isStudioAdmin: boolean) {
    if (isStudioAdmin) {
      return prisma.potteryRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          item: true,
          glaze: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });
    }

    return prisma.potteryRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        item: true,
        glaze: true,
      },
    });
  }

  static async getRequestById(requestId: string, userId: string, isStudioAdmin: boolean) {
    const request = await prisma.potteryRequest.findUnique({
      where: { id: requestId },
      include: {
        item: true,
        glaze: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      throw new NotFoundError('Pottery request not found.');
    }

    if (!isStudioAdmin && request.userId !== userId) {
      throw new NotFoundError('Pottery request not found.');
    }

    return request;
  }
}
