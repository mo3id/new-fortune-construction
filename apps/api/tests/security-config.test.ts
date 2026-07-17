import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { NextFunction, Response } from 'express';
import { getRequiredJwtSecret, getJwtSecretStatus } from '../src/config/runtime';
import { AuthRequest, protect } from '../src/middleware/auth';

function createAuthRequest(token: string): AuthRequest {
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  } as AuthRequest;
}

function createResponse(): Response & { statusCode: number; body?: unknown } {
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return response as Response & { statusCode: number; body?: unknown };
}

test('JWT secret status rejects missing, blank, and unsafe values', () => {
  assert.equal(getJwtSecretStatus(undefined), 'missing');
  assert.equal(getJwtSecretStatus(''), 'blank');
  assert.equal(getJwtSecretStatus('   '), 'blank');
  assert.equal(getJwtSecretStatus('secret'), 'unsafe');
  assert.equal(getJwtSecretStatus('local-safe-secret'), 'configured');
});

test('required JWT secret fails closed without fallback', () => {
  assert.throws(() => getRequiredJwtSecret({}), /JWT signing secret is not safely configured/);
  assert.throws(() => getRequiredJwtSecret({ JWT_SECRET: '' }), /JWT signing secret is not safely configured/);
  assert.throws(() => getRequiredJwtSecret({ JWT_SECRET: 'secret' }), /JWT signing secret is not safely configured/);
  assert.equal(getRequiredJwtSecret({ JWT_SECRET: 'local-safe-secret' }), 'local-safe-secret');
});

test('auth middleware fails closed when JWT secret is missing, blank, or unsafe', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const unsafeValues = [undefined, '', 'secret'];

  try {
    for (const value of unsafeValues) {
      if (value === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = value;
      }

      const req = createAuthRequest('invalid-token');
      const res = createResponse();
      let nextCalled = false;
      const next: NextFunction = () => {
        nextCalled = true;
      };

      protect(req, res, next);

      assert.equal(res.statusCode, 500);
      assert.deepEqual(res.body, {
        message: 'Authentication configuration error',
        code: 'AUTH_CONFIG_ERROR',
      });
      assert.equal(nextCalled, false);
    }
  } finally {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
});

test('auth middleware returns invalid token response when JWT secret is configured', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'local-safe-secret';

  try {
    const req = createAuthRequest('invalid-token');
    const res = createResponse();
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    protect(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'Invalid or expired token' });
    assert.equal(nextCalled, false);
  } finally {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
});
