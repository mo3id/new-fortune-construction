import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRequiredJwtSecret } from '../config/runtime';

export interface AuthRequest extends Request {
  adminId?: string;
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  const token = header.split(' ')[1];

  let jwtSecret: string;
  try {
    jwtSecret = getRequiredJwtSecret();
  } catch {
    res.status(500).json({
      message: 'Authentication configuration error',
      code: 'AUTH_CONFIG_ERROR',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
