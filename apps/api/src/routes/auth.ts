import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { protect, AuthRequest } from '../middleware/auth';
import { getRequiredJwtSecret } from '../config/runtime';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateRequest } from '../middleware/validateRequest';
import { authLoginSchema } from '../validation/schemas';

const router = Router();

router.post('/login', validateRequest({ body: authLoginSchema }), asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  let jwtSecret: string;
  try {
    jwtSecret = getRequiredJwtSecret();
  } catch {
    res.status(500).json({ message: 'Authentication configuration error', code: 'AUTH_CONFIG_ERROR' });
    return;
  }
  const token = jwt.sign({ id: admin._id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  } as jwt.SignOptions);
  res.json({ token, username: admin.username });
}));

router.get('/me', protect, asyncHandler<AuthRequest>(async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.adminId).select('-password');
  if (!admin) { res.status(404).json({ message: 'Admin not found' }); return; }
  res.json(admin);
}));

export default router;
