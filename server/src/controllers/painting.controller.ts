import { Request, Response, NextFunction } from 'express';
import { PaintingService } from '../services/painting.service';

export class PaintingController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paintings = await PaintingService.getAllPaintings();
      res.status(200).json({ success: true, data: paintings });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const painting = await PaintingService.getPaintingById(id);
      res.status(200).json({ success: true, data: painting });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const painting = await PaintingService.createPainting(req.body);
      res.status(201).json({ success: true, data: painting });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const painting = await PaintingService.updatePainting(id, req.body);
      res.status(200).json({ success: true, data: painting });
    } catch (error) {
      next(error);
    }
  }

  static async purchase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await PaintingService.purchasePainting(id, req.user!.id);
      res.status(201).json({
        success: true,
        message: 'Painting purchased successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStudioAdmin = req.user!.role === 'admin' || req.user!.role === 'studio';
      const orders = await PaintingService.getOrders(req.user!.id, isStudioAdmin);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const order = await PaintingService.cancelOrder(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully and painting availability restored',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}
