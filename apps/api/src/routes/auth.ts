import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password required' });
    return;
  }
  const admin = await Admin.findOne({ username });
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  } as jwt.SignOptions);
  res.json({ token, username: admin.username });
});

router.get('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.adminId).select('-password');
  if (!admin) { res.status(404).json({ message: 'Admin not found' }); return; }
  res.json(admin);
});

export default router;
