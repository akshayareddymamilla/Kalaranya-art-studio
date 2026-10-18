import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../lib/errors';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'studio';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-art-studio-jwt-secret-key-32chars-min';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    // 2. Check HttpOnly cookie
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthorizedError('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired authentication session'));
  }
}

/**
 * Optional authentication middleware: if token is present, populate req.user,
 * but do not throw 401 if missing.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
    } catch {
      // Ignore invalid token on optional auth routes
    }
  }
  next();
}

/**
 * Restrict access to specific roles.
 * Supports 'admin' / 'studio' equivalence.
 */
export function requireRole(allowedRoles: Array<'customer' | 'admin' | 'studio'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userRole = req.user.role;
    const isStudioAdmin = userRole === 'admin' || userRole === 'studio';

    const permitted = allowedRoles.some(role => {
      if (role === 'admin' || role === 'studio') {
        return isStudioAdmin;
      }
      return role === userRole;
    });

    if (!permitted) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
}
