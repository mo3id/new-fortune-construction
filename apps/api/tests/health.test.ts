import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestServer } from './helpers/appTestHarness';

interface HealthBody {
  status: string;
  timestamp: string;
  services: {
    api: string;
    database: string;
  };
  database: {
    mode: string;
  };
}

test('GET /health returns operational status without sensitive fields', async () => {
  const server = await createTestServer({
    mode: 'local',
    ready: true,
    isNewDatabase: false,
  });

  try {
    const response = await fetch(`${server.baseUrl}/health`);
    const body = (await response.json()) as HealthBody;

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
    assert.equal(body.services.api, 'ok');
    assert.equal(body.services.database, 'ok');
    assert.equal(body.database.mode, 'local');
    assert.equal(typeof body.timestamp, 'string');

    const serialized = JSON.stringify(body);
    assert.equal(serialized.includes('mongodb://'), false);
    assert.equal(serialized.includes('mongodb+srv://'), false);
    assert.equal(serialized.includes('JWT_SECRET'), false);
  } finally {
    await server.close();
  }
});

test('GET /health returns degraded status when database is unavailable', async () => {
  const server = await createTestServer({
    mode: 'unavailable',
    ready: false,
    isNewDatabase: false,
  });

  try {
    const response = await fetch(`${server.baseUrl}/health`);
    const body = (await response.json()) as HealthBody;

    assert.equal(response.status, 200);
    assert.equal(body.status, 'degraded');
    assert.equal(body.services.api, 'ok');
    assert.equal(body.services.database, 'unavailable');
    assert.equal(body.database.mode, 'unavailable');
  } finally {
    await server.close();
  }
});
