import { Request, Response, NextFunction } from 'express';
import { PotteryService } from '../services/pottery.service';

export class PotteryController {
  static async getOptions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = await PotteryService.getOptions();
      res.status(200).json({ success: true, data: options });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request = await PotteryService.createRequest(req.user!.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Pottery request submitted successfully',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await PotteryService.updateRequest(id, req.user!.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Pottery request updated successfully',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStudioAdmin = req.user!.role === 'admin' || req.user!.role === 'studio';
      const requests = await PotteryService.getRequests(req.user!.id, isStudioAdmin);
      res.status(200).json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isStudioAdmin = req.user!.role === 'admin' || req.user!.role === 'studio';
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await PotteryService.getRequestById(id, req.user!.id, isStudioAdmin);
      res.status(200).json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  static async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await PotteryService.acceptRequest(id);
      res.status(200).json({
        success: true,
        message: 'Pottery request accepted',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async decline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await PotteryService.declineRequest(id);
      res.status(200).json({
        success: true,
        message: 'Pottery request declined',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const request = await PotteryService.cancelRequest(id, req.user!.id);
      res.status(200).json({
        success: true,
        message: 'Pottery request cancelled',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }
}
