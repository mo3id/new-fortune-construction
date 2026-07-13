import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import JobApplication from '../models/JobApplication';
import { protect } from '../middleware/auth';

const uploadDir = path.join(__dirname, '../../uploads/cvs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post('/submit', upload.single('cvFile'), async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, phone, position, coverLetter } = req.body;
  const cvFile = req.file ? `/uploads/cvs/${req.file.filename}` : undefined;
  const application = await JobApplication.create({ fullName, email, phone, position, coverLetter, cvFile });
  res.status(201).json({ message: 'Application submitted successfully', id: application._id });
});

router.get('/', protect, async (req: Request, res: Response): Promise<void> => {
  const { status, position } = req.query;
  const filter: Record<string, string> = {};
  if (status) filter.status = status as string;
  if (position) filter.position = position as string;
  const applications = await JobApplication.find(filter).sort({ createdAt: -1 });
  res.json(applications);
});

router.patch('/:id/status', protect, async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const app = await JobApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!app) { res.status(404).json({ message: 'Not found' }); return; }
  res.json(app);
});

router.delete('/:id', protect, async (req: Request, res: Response): Promise<void> => {
  await JobApplication.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
