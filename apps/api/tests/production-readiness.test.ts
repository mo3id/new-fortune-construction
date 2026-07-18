import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { NextFunction, Request, Response } from 'express';
import { createCorsOptions } from '../src/config/cors';
import {
  allowsRemoteDatabase,
  getRequiredJwtSecret,
  getJwtSecretStatus,
  loadRuntimeConfig,
} from '../src/config/runtime';
import { ApiError, errorHandler } from '../src/middleware/errors';
import { redactSensitiveValue } from '../src/utils/redaction';

const publicOrigin = 'https://fortuneconstruction.mw';
const dashboardOrigin = 'https://dashboard.fortuneconstruction.mw';
const apiOrigin = 'https://api.fortuneconstruction.mw';
const remoteUri = 'mongodb+srv://dbUser:dbPassword@cluster.example.mongodb.net/prod';
const jwtSecret = 'production-readiness-test-secret';

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

test('production runtime config uses configured public, dashboard, and additional CORS origins', () => {
  const config = loadRuntimeConfig({
    NODE_ENV: 'production',
    PUBLIC_SITE_ORIGIN: publicOrigin,
    DASHBOARD_ORIGIN: dashboardOrigin,
    ADDITIONAL_ALLOWED_ORIGINS: `${apiOrigin}, https://preview.fortuneconstruction.mw `,
    JWT_SECRET: jwtSecret,
    MONGODB_URI: remoteUri,
  });

  assert.deepEqual(config.allowedOrigins, [
    publicOrigin,
    dashboardOrigin,
    apiOrigin,
    'https://preview.fortuneconstruction.mw',
  ]);
});

test('production runtime config does not fall back to localhost CORS origins', () => {
  assert.throws(
    () =>
      loadRuntimeConfig({
        NODE_ENV: 'production',
        DASHBOARD_ORIGIN: dashboardOrigin,
        JWT_SECRET: jwtSecret,
        MONGODB_URI: remoteUri,
      }),
    /PUBLIC_SITE_ORIGIN must be configured for production/
  );

  assert.throws(
    () =>
      loadRuntimeConfig({
        NODE_ENV: 'production',
        PUBLIC_SITE_ORIGIN: publicOrigin,
        JWT_SECRET: jwtSecret,
        MONGODB_URI: remoteUri,
      }),
    /DASHBOARD_ORIGIN must be configured for production/
  );
});

test('production CORS allows configured origins and rejects disallowed browser origins', async () => {
  const config = loadRuntimeConfig({
    NODE_ENV: 'production',
    PUBLIC_SITE_ORIGIN: publicOrigin,
    DASHBOARD_ORIGIN: dashboardOrigin,
    JWT_SECRET: jwtSecret,
    MONGODB_URI: remoteUri,
  });
  const options = createCorsOptions(config);
  assert.equal(typeof options.origin, 'function');

  const checkOrigin = (origin?: string) =>
    new Promise<unknown>((resolve, reject) => {
      if (typeof options.origin !== 'function') {
        reject(new Error('CORS origin option is not callable'));
        return;
      }

      options.origin(origin, (error, allowed) => {
        if (error) reject(error);
        else resolve(allowed);
      });
    });

  assert.equal(await checkOrigin(publicOrigin), publicOrigin);
  assert.equal(await checkOrigin(dashboardOrigin), dashboardOrigin);
  assert.equal(await checkOrigin('https://not-allowed.example'), false);
  assert.equal(await checkOrigin(undefined), true);
});

test('JWT secret policy fails closed for missing, blank, and unsafe values', () => {
  assert.equal(getJwtSecretStatus(undefined), 'missing');
  assert.equal(getJwtSecretStatus(''), 'blank');
  assert.equal(getJwtSecretStatus('   '), 'blank');
  assert.equal(getJwtSecretStatus('secret'), 'unsafe');
  assert.throws(() => getRequiredJwtSecret({}), /JWT signing secret is not safely configured/);
  assert.throws(() => getRequiredJwtSecret({ JWT_SECRET: '' }), /JWT signing secret is not safely configured/);
  assert.throws(() => getRequiredJwtSecret({ JWT_SECRET: 'secret' }), /JWT signing secret is not safely configured/);
  assert.equal(getRequiredJwtSecret({ JWT_SECRET: jwtSecret }), jwtSecret);
});

test('MongoDB remote URI remains blocked locally unless production or explicit allow flag is used', () => {
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'development', MONGODB_URI: remoteUri }), false);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'test', MONGODB_URI: remoteUri }), false);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'development', MONGODB_URI: remoteUri, ALLOW_REMOTE_DB: 'true' }), true);
  assert.equal(allowsRemoteDatabase({ NODE_ENV: 'production', MONGODB_URI: remoteUri }), true);
});

test('redaction removes DB URI credentials, JWT secret, and stack traces from logs and client responses', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = jwtSecret;

  try {
    const redactedLog = redactSensitiveValue(`failed ${remoteUri} with ${jwtSecret} and dbUser:dbPassword`);
    assert.equal(redactedLog.includes(remoteUri), false);
    assert.equal(redactedLog.includes(jwtSecret), false);
    assert.equal(redactedLog.includes('dbUser:dbPassword'), false);
    assert.equal(redactedLog.includes('mongodb+srv://<redacted>@cluster.example.mongodb.net/<redacted>'), true);

    const error = new ApiError(400, `Invalid ${remoteUri} ${jwtSecret}`, 'PROD_READY_TEST');
    const response = invokeErrorHandler(error);
    const serialized = JSON.stringify(response.body);

    assert.equal(response.statusCode, 400);
    assert.equal(serialized.includes(remoteUri), false);
    assert.equal(serialized.includes(jwtSecret), false);
    assert.equal(serialized.includes(' at '), false);
  } finally {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
});
