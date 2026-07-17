import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Admin from '../src/models/Admin';
import { createTestServer } from './helpers/appTestHarness';

test('auth login preserves valid success response shape', async () => {
  const originalFindOne = Admin.findOne;
  process.env.JWT_SECRET = 'local-safe-secret';

  Admin.findOne = ((() =>
    ({
      comparePassword: async () => true,
      _id: '507f1f77bcf86cd799439011',
      username: 'admin-user',
    })) as unknown) as typeof Admin.findOne;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin-user', password: 'submitted-password' }),
    });
    const body = (await response.json()) as { token?: string; username?: string };

    assert.equal(response.status, 200);
    assert.equal(typeof body.token, 'string');
    assert.equal(body.username, 'admin-user');
  } finally {
    await server.close();
    Admin.findOne = originalFindOne;
  }
});

test('auth login fails closed when JWT secret is unsafe', async () => {
  const originalFindOne = Admin.findOne;
  process.env.JWT_SECRET = 'secret';

  Admin.findOne = ((() =>
    ({
      comparePassword: async () => true,
      _id: '507f1f77bcf86cd799439011',
      username: 'admin-user',
    })) as unknown) as typeof Admin.findOne;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin-user', password: 'submitted-password' }),
    });
    const body = (await response.json()) as { code?: string; token?: string };

    assert.equal(response.status, 500);
    assert.equal(body.code, 'AUTH_CONFIG_ERROR');
    assert.equal(body.token, undefined);
  } finally {
    await server.close();
    Admin.findOne = originalFindOne;
    process.env.JWT_SECRET = 'local-test-secret';
  }
});
