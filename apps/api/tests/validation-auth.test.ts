import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Admin from '../src/models/Admin';
import { createTestServer } from './helpers/appTestHarness';

interface ValidationBody {
  message?: string;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
  token?: string;
  username?: string;
}

test('auth login rejects invalid payload with contract validation shape', async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '', password: '' }),
    });
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 400);
    assert.equal(body.message, 'Invalid request');
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.details?.some((detail) => detail.field === 'username'));
    assert.ok(body.details?.some((detail) => detail.field === 'password'));
    assert.equal(body.token, undefined);
  } finally {
    await server.close();
  }
});

test('auth login accepts current valid dashboard payload shape', async () => {
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
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 200);
    assert.equal(typeof body.token, 'string');
    assert.equal(body.username, 'admin-user');
  } finally {
    await server.close();
    Admin.findOne = originalFindOne;
    process.env.JWT_SECRET = 'local-test-secret';
  }
});
