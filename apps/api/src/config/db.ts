import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';

let memServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('localhost')) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MongoDB connected (Atlas/Remote)');
      return false;
    } catch (err) {
      console.error('❌ Failed to connect to MONGODB_URI:', uri);
    }
  }

  try {
    await mongoose.connect('mongodb://localhost:27017/fortune-construction', { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB connected (local)');
    return false;
  } catch {
    // fall through to persistent file-backed in-memory
  }

  const dbPath = path.join(__dirname, '../../.mongodb-data');
  const isNewDb = !fs.existsSync(dbPath);
  if (isNewDb) fs.mkdirSync(dbPath, { recursive: true });

  console.log('⚡ Starting persistent local MongoDB...');
  memServer = await MongoMemoryServer.create({
    instance: {
      dbPath,
      storageEngine: 'wiredTiger',
    },
  });
  const memUri = memServer.getUri();
  await mongoose.connect(memUri);
  console.log(`✅ MongoDB connected (persistent file storage at .mongodb-data/)`);
  console.log('   → Data survives restarts. Set MONGODB_URI in .env for cloud Atlas.');
  return isNewDb; // only auto-seed on first run (empty db directory)
}

export async function stopDB(): Promise<void> {
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
}
