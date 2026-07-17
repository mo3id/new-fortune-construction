import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestServer } from './helpers/appTestHarness';

test('CORS allows configured public site and dashboard origins', async () => {
  const server = await createTestServer();

  try {
    const publicResponse = await fetch(`${server.baseUrl}/health`, {
      headers: { Origin: 'http://localhost:5173' },
    });
    const dashboardResponse = await fetch(`${server.baseUrl}/health`, {
      headers: { Origin: 'http://localhost:5174' },
    });

    assert.equal(publicResponse.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(dashboardResponse.headers.get('access-control-allow-origin'), 'http://localhost:5174');
  } finally {
    await server.close();
  }
});

test('CORS rejects unapproved browser origins', async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/health`, {
      headers: { Origin: 'http://evil.localhost' },
    });

    assert.equal(response.status, 403);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  } finally {
    await server.close();
  }
});

test('CORS preserves no-origin local health probes', async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/health`);
    const body = (await response.json()) as { status: string };

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
  } finally {
    await server.close();
  }
});
