import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { safeLogger } from '../utils/safeLogger';
import { allowsRemoteDatabase, isRemoteMongoUri } from './runtime';

let memServer: MongoMemoryServer | null = null;

export type DatabaseMode = 'remote' | 'local' | 'memory' | 'unavailable';

export interface DatabaseStatus {
  mode: DatabaseMode;
  ready: boolean;
  isNewDatabase: boolean;
}

export async function connectDB(): Promise<DatabaseStatus> {
  const uri = process.env.MONGODB_URI;

  if (isRemoteMongoUri(uri)) {
    if (!allowsRemoteDatabase()) {
      safeLogger.warn('Remote MongoDB URI configured but not allowed for this local runtime; skipping remote connection.');
    } else if (uri) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        safeLogger.info('MongoDB connected (remote)');
        return { mode: 'remote', ready: true, isNewDatabase: false };
      } catch (err) {
        safeLogger.error('Failed to connect to configured remote MongoDB; falling back to local options.', err);
      }
    }
  }

  try {
    await mongoose.connect('mongodb://localhost:27017/fortune-construction', { serverSelectionTimeoutMS: 3000 });
    safeLogger.info('MongoDB connected (local)');
    return { mode: 'local', ready: true, isNewDatabase: false };
  } catch {
    // fall through to persistent file-backed in-memory
  }

  const dbPath = path.join(__dirname, '../../.mongodb-data');
  const isNewDb = !fs.existsSync(dbPath);
  if (isNewDb) fs.mkdirSync(dbPath, { recursive: true });

  try {
    safeLogger.info('Starting persistent local MongoDB...');
    memServer = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger',
      },
    });
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    safeLogger.info('MongoDB connected (persistent file storage at .mongodb-data/)');
    safeLogger.info('Data survives restarts. Set MONGODB_URI in .env for cloud Atlas.');
    return { mode: 'memory', ready: true, isNewDatabase: isNewDb };
  } catch (err) {
    safeLogger.error('Failed to start persistent local MongoDB fallback.', err);
  }

  try {
    const tempDbPath = fs.mkdtempSync(path.join(os.tmpdir(), 'fortune-api-mongo-'));
    safeLogger.warn('Starting temporary local MongoDB because persistent local storage is unavailable.');
    memServer = await MongoMemoryServer.create({
      instance: {
        dbPath: tempDbPath,
        storageEngine: 'wiredTiger',
      },
    });
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    safeLogger.info('MongoDB connected (temporary local storage)');
    return { mode: 'memory', ready: true, isNewDatabase: true };
  } catch (err) {
    safeLogger.error('Failed to start any local MongoDB fallback.', err);
    return { mode: 'unavailable', ready: false, isNewDatabase: false };
  }
}

export async function stopDB(): Promise<void> {
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
}
