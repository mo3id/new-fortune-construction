import './setup';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../src/config/db';

const remoteUri = 'mongodb+srv://dbUser:dbPassword@cluster.example.mongodb.net/prod?retryWrites=true';
const jwtSecret = 'super-local-test-secret';

function sourceFile(relativePath: string): string {
  return path.join(__dirname, '..', 'src', relativePath);
}

test('database connection logs redact remote DB URI credentials and JWT secret values', async () => {
  const originalEnv = { ...process.env };
  const originalConnect = mongoose.connect;
  const originalCreate = MongoMemoryServer.create;
  const originalWarn = console.warn;
  const originalError = console.error;
  const logs: string[] = [];

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = remoteUri;
  process.env.ALLOW_REMOTE_DB = 'true';
  process.env.JWT_SECRET = jwtSecret;

  (mongoose.connect as unknown as (uri: string) => Promise<unknown>) = async (uri: string) => {
    throw new Error(`Could not connect to ${uri} using ${jwtSecret}`);
  };
  MongoMemoryServer.create = (async () => {
    throw new Error(`Memory fallback failed after ${remoteUri}`);
  }) as typeof MongoMemoryServer.create;

  console.warn = (message?: unknown) => {
    logs.push(String(message));
  };
  console.error = (message?: unknown) => {
    logs.push(String(message));
  };

  try {
    const status = await connectDB();
    assert.equal(status.mode, 'unavailable');
    assert.equal(status.ready, false);

    const combinedLogs = logs.join('\n');
    assert.equal(combinedLogs.includes(remoteUri), false);
    assert.equal(combinedLogs.includes('dbUser'), false);
    assert.equal(combinedLogs.includes('dbPassword'), false);
    assert.equal(combinedLogs.includes(jwtSecret), false);
    assert.equal(combinedLogs.includes('mongodb+srv://<redacted>@cluster.example.mongodb.net/<redacted>'), true);
  } finally {
    mongoose.connect = originalConnect;
    MongoMemoryServer.create = originalCreate;
    console.warn = originalWarn;
    console.error = originalError;
    process.env = originalEnv;
  }
});

test('startup and seed log messages do not print default login credentials', () => {
  const files = ['autoSeed.ts', 'seed.ts', 'index.ts'];
  const loggingLines = files.flatMap((file) =>
    fs
      .readFileSync(sourceFile(file), 'utf8')
      .split('\n')
      .filter((line) => /(?:console|safeLogger)\.(?:log|info|warn|error)/.test(line))
      .map((line) => `${file}: ${line.trim()}`)
  );

  const combinedLogs = loggingLines.join('\n');
  assert.equal(combinedLogs.includes('admin / admin123'), false);
  assert.equal(combinedLogs.includes('admin123'), false);
  assert.equal(/login:\s*admin/i.test(combinedLogs), false);
});
