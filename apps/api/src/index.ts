import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import serviceRoutes from './routes/services';
import partnerRoutes from './routes/partners';
import teamRoutes from './routes/team';
import jobRoutes from './routes/jobs';
import applicationRoutes from './routes/applications';
import messageRoutes from './routes/messages';
import settingsRoutes from './routes/settings';
import uploadRoutes from './routes/upload';
import statsRoutes from './routes/stats';
import pageContentRoutes from './routes/pageContent';
import successStoryRoutes from './routes/successStories';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

async function startServer() {
  const isInMemory = await connectDB();
  if (isInMemory) {
    const { autoSeed } = await import('./autoSeed');
    await autoSeed();
  }

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  }));

  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
  app.use(limiter);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/team', teamRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/content', pageContentRoutes);
  app.use('/api/success-stories', successStoryRoutes);

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

  app.listen(PORT, () => {
    console.log(`✅ Fortune API running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
