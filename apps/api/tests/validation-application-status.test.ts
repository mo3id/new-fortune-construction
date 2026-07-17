import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader } from './helpers/uploadTestHelpers';

interface ValidationBody {
  message?: string;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
  status?: string;
}

test('application status update rejects invalid status with contract validation shape', async () => {
  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/applications/507f1f77bcf86cd799439011/status`, {
      method: 'PATCH',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'archived' }),
    });
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 400);
    assert.equal(body.message, 'Invalid request');
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.details?.some((detail) => detail.field === 'status'));
  } finally {
    await server.close();
  }
});

test('application status update accepts current valid dashboard payload shape', async () => {
  const originalFindByIdAndUpdate = JobApplication.findByIdAndUpdate;
  JobApplication.findByIdAndUpdate = ((async (_id: string, update: { status?: string }) => ({
    _id: '507f1f77bcf86cd799439011',
    status: update.status,
  })) as unknown) as typeof JobApplication.findByIdAndUpdate;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/applications/507f1f77bcf86cd799439011/status`, {
      method: 'PATCH',
      headers: {
        Authorization: authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'reviewed' }),
    });
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 200);
    assert.equal(body.status, 'reviewed');
  } finally {
    await server.close();
    JobApplication.findByIdAndUpdate = originalFindByIdAndUpdate;
  }
});
