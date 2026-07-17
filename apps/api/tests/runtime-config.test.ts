import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { allowsRemoteDatabase, isRemoteMongoUri, loadRuntimeConfig } from '../src/config/runtime';

test('runtime config does not require production database credentials for local startup', () => {
  const config = loadRuntimeConfig({
    NODE_ENV: 'test',
    PORT: '3001',
    JWT_SECRET: 'local-test-secret',
  });

  assert.equal(config.usesRemoteDatabase, false);
  assert.equal(config.port, 3001);
  assert.equal(config.jwtSecretStatus, 'configured');
  assert.deepEqual(config.allowedOrigins, ['http://localhost:5173', 'http://localhost:5174']);
});

test('remote MongoDB URI detection distinguishes local and remote values', () => {
  assert.equal(isRemoteMongoUri(undefined), false);
  assert.equal(isRemoteMongoUri('mongodb://localhost:27017/fortune-construction'), false);
  assert.equal(isRemoteMongoUri('mongodb://127.0.0.1:27017/fortune-construction'), false);
  assert.equal(isRemoteMongoUri('mongodb+srv://user:pass@example.mongodb.net/prod'), true);
});

test('remote MongoDB URI is blocked outside production unless explicitly allowed', () => {
  const remoteUri = 'mongodb+srv://user:pass@example.mongodb.net/prod';

  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'development', MONGODB_URI: remoteUri }), false);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'test', MONGODB_URI: remoteUri }), false);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'production', MONGODB_URI: remoteUri }), true);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'development', MONGODB_URI: remoteUri, ALLOW_REMOTE_DB: 'true' }), true);
});

test('runtime config exposes blocked remote database status for local environments', () => {
  const config = loadRuntimeConfig({
    NODE_ENV: 'development',
    JWT_SECRET: 'local-test-secret',
    MONGODB_URI: 'mongodb+srv://user:pass@example.mongodb.net/prod',
  });

  assert.equal(config.usesRemoteDatabase, true);
  assert.equal(config.allowRemoteDatabase, false);
});
