import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader } from './helpers/uploadTestHelpers';

interface ErrorBody {
  message?: string;
  code?: string;
  stack?: string;
}

test('application route async failures return non-sensitive internal error shape', async () => {
  const originalFind = JobApplication.find;
  JobApplication.find = ((() => {
    throw new Error('database exploded with mongodb+srv://user:pass@example.mongodb.net/prod');
  }) as unknown) as typeof JobApplication.find;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/applications`, {
      headers: { Authorization: authHeader() },
    });
    const body = (await response.json()) as ErrorBody;

    assert.equal(response.status, 500);
    assert.deepEqual(body, {
      message: 'Unexpected server error',
      code: 'INTERNAL_ERROR',
    });
    assert.equal(JSON.stringify(body).includes('mongodb+srv://'), false);
    assert.equal('stack' in body, false);
  } finally {
    await server.close();
    JobApplication.find = originalFind;
  }
});
