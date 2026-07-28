import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/auth';
import { ApiError } from '../middleware/errors';
import { sanitizeUploadFilename, uploadFileFilter, uploadSizeLimit } from '../utils/uploadValidation';

const imageUploadDir = path.join(__dirname, '../../uploads/images');
const videoUploadDir = path.join(__dirname, '../../uploads/videos');
if (!fs.existsSync(imageUploadDir)) fs.mkdirSync(imageUploadDir, { recursive: true });
if (!fs.existsSync(videoUploadDir)) fs.mkdirSync(videoUploadDir, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imageUploadDir),
  filename: (_req, file, cb) => {
    cb(null, sanitizeUploadFilename(file.originalname));
  },
});

const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, videoUploadDir),
  filename: (_req, file, cb) => {
    cb(null, sanitizeUploadFilename(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: uploadSizeLimit('image') },
  fileFilter: uploadFileFilter('image'),
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: uploadSizeLimit('video') },
  fileFilter: uploadFileFilter('video'),
});

const router = Router();

router.post('/', protect, imageUpload.single('image'), (req: Request, res: Response): void => {
  if (!req.file) { throw new ApiError(400, 'Invalid upload', 'UPLOAD_VALIDATION_ERROR'); }
  const url = `/uploads/images/${req.file.filename}`;
  res.json({ url, type: 'image' });
});

router.post('/video', protect, videoUpload.single('video'), (req: Request, res: Response): void => {
  if (!req.file) { throw new ApiError(400, 'Invalid upload', 'UPLOAD_VALIDATION_ERROR'); }
  const url = `/uploads/videos/${req.file.filename}`;
  res.json({ url, type: 'video' });
});

export default router;
