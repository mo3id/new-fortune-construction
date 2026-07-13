import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth';

const imageUploadDir = path.join(__dirname, '../../uploads/images');
const videoUploadDir = path.join(__dirname, '../../uploads/videos');
if (!fs.existsSync(imageUploadDir)) fs.mkdirSync(imageUploadDir, { recursive: true });
if (!fs.existsSync(videoUploadDir)) fs.mkdirSync(videoUploadDir, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imageUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, videoUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /mp4|webm|mov|avi/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (mp4, webm, mov, avi) are allowed'));
    }
  },
});

const router = Router();

router.post('/', protect, imageUpload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) { res.status(400).json({ message: 'No file uploaded' }); return; }
  const url = `/uploads/images/${req.file.filename}`;
  res.json({ url, type: 'image' });
});

router.post('/video', protect, videoUpload.single('video'), (req: Request, res: Response): void => {
  if (!req.file) { res.status(400).json({ message: 'No video uploaded' }); return; }
  const url = `/uploads/videos/${req.file.filename}`;
  res.json({ url, type: 'video' });
});

export default router;
