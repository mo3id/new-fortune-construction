import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Service from '../src/models/Service';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll, sortedResult } from './helpers/contractTestHelpers';

const service = {
  _id: '507f1f77bcf86cd799439301',
  title: 'Civil Works',
  tagline: 'Infrastructure delivery',
  description: 'Roads and bridges',
  features: ['Roads'],
  bgImage: '/uploads/images/service.jpg',
  order: 1,
};

test('services public list and dashboard mutations preserve array/object/message contracts', async () => {
  const restores = [
    replaceStatic(Service, 'find', () => sortedResult([service])),
    replaceStatic(Service, 'create', async (body: object) => ({ ...service, ...body })),
    replaceStatic(Service, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...service, ...body })),
    replaceStatic(Service, 'findByIdAndDelete', async () => service),
  ];
  const server = await createTestServer();

  try {
    const listResponse = await fetch(`${server.baseUrl}/api/services`);
    const list = await readJson<Array<Record<string, unknown>>>(listResponse);
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(list), true);
    assert.equal(list[0].title, service.title);

    const createResponse = await jsonRequest(server.baseUrl, '/api/services', 'POST', { title: 'Design', tagline: 'Planning', description: 'Plans' }, authHeader());
    assert.equal(createResponse.status, 201);
    assert.equal((await readJson<Record<string, unknown>>(createResponse)).title, 'Design');

    const updateResponse = await jsonRequest(server.baseUrl, `/api/services/${service._id}`, 'PUT', { title: 'Updated Design' }, authHeader());
    assert.equal(updateResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(updateResponse)).title, 'Updated Design');

    const deleteResponse = await fetch(`${server.baseUrl}/api/services/${service._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
