import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';

export class BookingController {
  static async getAvailability(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const occupiedDates = await BookingService.getOccupiedDates();
      const ratePerSqFt = await BookingService.getRatePerSqFt();
      res.status(200).json({
        success: true,
        data: {
          occupiedDates,
          ratePerSqFt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await BookingService.createBooking(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Wall painting booking requested successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStudioAdmin = req.user!.role === 'admin' || req.user!.role === 'studio';
      const bookings = await BookingService.getBookings(req.user!.id, isStudioAdmin);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStudioAdmin = req.user!.role === 'admin' || req.user!.role === 'studio';
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await BookingService.getBookingById(id, req.user!.id, isStudioAdmin);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  static async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await BookingService.confirmBooking(id);
      res.status(200).json({
        success: true,
        message: 'Booking confirmed successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  static async decline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await BookingService.declineBooking(id);
      res.status(200).json({
        success: true,
        message: 'Booking declined',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const booking = await BookingService.cancelBooking(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}
