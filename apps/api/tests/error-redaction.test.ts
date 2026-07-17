import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { NextFunction, Request, Response } from 'express';
import { ApiError, errorHandler } from '../src/middleware/errors';

const remoteUri = 'mongodb+srv://dbUser:dbPassword@cluster.example.mongodb.net/prod';
const jwtSecret = 'super-local-test-secret';

function createResponse(): Response & { statusCode: number; body?: unknown } {
  const response = {
    headersSent: false,
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

function invokeErrorHandler(error: unknown) {
  const response = createResponse();
  errorHandler(error, {} as Request, response, (() => undefined) as NextFunction);
  return response;
}

function assertNoSensitiveResponseContent(body: unknown): void {
  const serialized = JSON.stringify(body);
  assert.equal(serialized.includes(remoteUri), false);
  assert.equal(serialized.includes('dbUser'), false);
  assert.equal(serialized.includes('dbPassword'), false);
  assert.equal(serialized.includes(jwtSecret), false);
  assert.equal(serialized.includes('Error:'), false);
  assert.equal(serialized.includes(' at '), false);
}

test('client ApiError responses redact sensitive values from messages and details', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = jwtSecret;

  try {
    const response = invokeErrorHandler(
      new ApiError(400, `Invalid value from ${remoteUri} with ${jwtSecret}`, 'VALIDATION_ERROR', [
        {
          field: 'database',
          message: `Rejected credential dbUser:dbPassword and ${remoteUri}`,
        },
      ])
    );

    assert.equal(response.statusCode, 400);
    assertNoSensitiveResponseContent(response.body);
    assert.deepEqual(response.body, {
      message: 'Invalid value from mongodb+srv://<redacted>@cluster.example.mongodb.net/<redacted> with <redacted-secret>',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'database',
          message: 'Rejected credential <redacted-credential> and mongodb+srv://<redacted>@cluster.example.mongodb.net/<redacted>',
        },
      ],
    });
  } finally {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
});

test('unexpected client error responses omit stack traces and raw exception content', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalError = console.error;
  process.env.JWT_SECRET = jwtSecret;
  console.error = () => undefined;

  try {
    const error = new Error(`Exploded with ${remoteUri} and ${jwtSecret}`);
    error.stack = `Error: ${error.message}\n    at unsafeHandler (/tmp/app.ts:10:5)`;

    const response = invokeErrorHandler(error);

    assert.equal(response.statusCode, 500);
    assert.deepEqual(response.body, {
      message: 'Unexpected server error',
      code: 'INTERNAL_ERROR',
    });
    assertNoSensitiveResponseContent(response.body);
  } finally {
    console.error = originalError;
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
});
