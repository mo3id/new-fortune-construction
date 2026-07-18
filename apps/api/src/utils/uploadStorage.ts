import fs from 'fs';
import os from 'os';
import path from 'path';

export function uploadBaseDir(): string {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    return path.join(os.tmpdir(), 'fortune-uploads');
  }

  return path.join(__dirname, '../../uploads');
}

export function ensureUploadDir(folder: 'cvs' | 'images' | 'videos'): string {
  const dir = path.join(uploadBaseDir(), folder);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
