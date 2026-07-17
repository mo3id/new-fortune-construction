import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createTestServer } from './helpers/appTestHarness';
import { connectDB, DatabaseMode } from '../src/config/db';

interface HealthBody {
  status: string;
  database: {
    mode: string;
  };
}

async function getHealthForMode(mode: DatabaseMode, ready: boolean) {
  const server = await createTestServer({
    mode,
    ready,
    isNewDatabase: false,
  });

  try {
    const response = await fetch(`${server.baseUrl}/health`);
    return (await response.json()) as HealthBody;
  } finally {
    await server.close();
  }
}

test('health reports local database readiness mode', async () => {
  const body = await getHealthForMode('local', true);
  assert.equal(body.status, 'ok');
  assert.equal(body.database.mode, 'local');
});

test('health reports memory database readiness mode', async () => {
  const body = await getHealthForMode('memory', true);
  assert.equal(body.status, 'ok');
  assert.equal(body.database.mode, 'memory');
});

test('health reports unavailable database readiness mode as degraded', async () => {
  const body = await getHealthForMode('unavailable', false);
  assert.equal(body.status, 'degraded');
  assert.equal(body.database.mode, 'unavailable');
});

test('connectDB skips remote MongoDB URI in non-production without explicit allow flag', async () => {
  const originalEnv = { ...process.env };
  const originalConnect = mongoose.connect;
  const originalCreate = MongoMemoryServer.create;
  const attemptedUris: string[] = [];
  let memoryCreateAttempts = 0;

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb+srv://user:pass@example.mongodb.net/prod';
  delete process.env.ALLOW_REMOTE_DB;

  (mongoose.connect as unknown as (uri: string) => Promise<unknown>) = async (uri: string) => {
    attemptedUris.push(uri);
    throw new Error('forced local failure');
  };
  MongoMemoryServer.create = (async () => {
    memoryCreateAttempts += 1;
    throw new Error('forced memory failure');
  }) as typeof MongoMemoryServer.create;

  try {
    const status = await connectDB();
    assert.equal(status.mode, 'unavailable');
    assert.equal(status.ready, false);
    assert.equal(
      attemptedUris.some((uri) => uri.includes('example.mongodb.net')),
      false
    );
    assert.deepEqual(attemptedUris, ['mongodb://localhost:27017/fortune-construction']);
    assert.equal(memoryCreateAttempts, 2);
  } finally {
    mongoose.connect = originalConnect;
    MongoMemoryServer.create = originalCreate;
    process.env = originalEnv;
  }
});

test('connectDB uses temporary local MongoDB when persistent fallback is unavailable', async () => {
  const originalEnv = { ...process.env };
  const originalConnect = mongoose.connect;
  const originalCreate = MongoMemoryServer.create;
  const attemptedUris: string[] = [];
  let memoryCreateAttempts = 0;

  delete process.env.MONGODB_URI;

  (mongoose.connect as unknown as (uri: string) => Promise<unknown>) = async (uri: string) => {
    attemptedUris.push(uri);
    if (uri === 'mongodb://localhost:27017/fortune-construction') {
      throw new Error('forced local failure');
    }
    return undefined;
  };
  MongoMemoryServer.create = (async () => {
    memoryCreateAttempts += 1;
    if (memoryCreateAttempts === 1) {
      throw new Error('forced persistent memory failure');
    }
    return {
      getUri: () => 'mongodb://127.0.0.1:27099/temp-test-db',
      stop: async () => undefined,
    };
  }) as unknown as typeof MongoMemoryServer.create;

  try {
    const status = await connectDB();
    assert.equal(status.mode, 'memory');
    assert.equal(status.ready, true);
    assert.equal(status.isNewDatabase, true);
    assert.equal(memoryCreateAttempts, 2);
    assert.deepEqual(attemptedUris, [
      'mongodb://localhost:27017/fortune-construction',
      'mongodb://127.0.0.1:27099/temp-test-db',
    ]);
  } finally {
    mongoose.connect = originalConnect;
    MongoMemoryServer.create = originalCreate;
    process.env = originalEnv;
  }
});
