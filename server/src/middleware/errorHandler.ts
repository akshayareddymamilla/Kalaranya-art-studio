import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../lib/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Handled application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // 2. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json({
        success: false,
        error: `A record with this ${target} already exists.`,
      });
      return;
    }
    // Record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Requested record was not found.',
      });
      return;
    }
  }

  // 3. SQLite raw constraint errors
  if (err.message && (err.message.includes('UNIQUE constraint failed') || err.message.includes('SQLITE_CONSTRAINT'))) {
    res.status(409).json({
      success: false,
      error: 'Conflict: This item or date has already been booked or purchased.',
    });
    return;
  }

  // 4. Unexpected server error
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred.',
  });
}
