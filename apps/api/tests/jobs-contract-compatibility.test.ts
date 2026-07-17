import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import JobPosition from '../src/models/JobPosition';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll, sortedResult } from './helpers/contractTestHelpers';

const job = {
  _id: '507f1f77bcf86cd799439601',
  title: 'Site Engineer',
  location: 'Lilongwe',
  type: 'Full-time',
  description: 'Manage site delivery',
  requirements: ['Degree'],
  isActive: true,
};

test('jobs public active list and dashboard all/write contracts stay compatible', async () => {
  const findCalls: unknown[] = [];
  const restores = [
    replaceStatic(JobPosition, 'find', (filter?: unknown) => {
      findCalls.push(filter);
      return sortedResult([job]);
    }),
    replaceStatic(JobPosition, 'create', async (body: object) => ({ ...job, ...body })),
    replaceStatic(JobPosition, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...job, ...body })),
    replaceStatic(JobPosition, 'findByIdAndDelete', async () => job),
  ];
  const server = await createTestServer();

  try {
    const publicResponse = await fetch(`${server.baseUrl}/api/jobs`);
    const publicJobs = await readJson<Array<Record<string, unknown>>>(publicResponse);
    assert.equal(publicResponse.status, 200);
    assert.deepEqual(findCalls[0], { isActive: true });
    assert.equal(publicJobs[0].isActive, true);

    const allResponse = await fetch(`${server.baseUrl}/api/jobs/all`, { headers: authHeader() });
    assert.equal(allResponse.status, 200);
    assert.deepEqual(findCalls[1], undefined);
    assert.equal(Array.isArray(await readJson(allResponse)), true);

    const createResponse = await jsonRequest(server.baseUrl, '/api/jobs', 'POST', { title: 'Foreman', location: 'Blantyre', type: 'Contract', description: 'Lead crews' }, authHeader());
    assert.equal(createResponse.status, 201);
    assert.equal((await readJson<Record<string, unknown>>(createResponse)).title, 'Foreman');

    const updateResponse = await jsonRequest(server.baseUrl, `/api/jobs/${job._id}`, 'PUT', { isActive: false }, authHeader());
    assert.equal(updateResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(updateResponse)).isActive, false);

    const deleteResponse = await fetch(`${server.baseUrl}/api/jobs/${job._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
