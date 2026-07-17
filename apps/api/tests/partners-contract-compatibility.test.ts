import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Partner from '../src/models/Partner';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll, sortedResult } from './helpers/contractTestHelpers';

const partner = {
  _id: '507f1f77bcf86cd799439401',
  name: 'Road Authority',
  abbr: 'RA',
  logo: '/uploads/images/ra.png',
  website: 'https://example.test',
  description: 'Public partner',
  order: 1,
};

test('partners public list and dashboard mutations preserve current contracts', async () => {
  const restores = [
    replaceStatic(Partner, 'find', () => sortedResult([partner])),
    replaceStatic(Partner, 'create', async (body: object) => ({ ...partner, ...body })),
    replaceStatic(Partner, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...partner, ...body })),
    replaceStatic(Partner, 'findByIdAndDelete', async () => partner),
  ];
  const server = await createTestServer();

  try {
    const listResponse = await fetch(`${server.baseUrl}/api/partners`);
    const list = await readJson<Array<Record<string, unknown>>>(listResponse);
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(list), true);
    assert.equal(list[0].abbr, 'RA');

    const createResponse = await jsonRequest(server.baseUrl, '/api/partners', 'POST', { name: 'New Partner', abbr: 'NP' }, authHeader());
    assert.equal(createResponse.status, 201);
    assert.equal((await readJson<Record<string, unknown>>(createResponse)).name, 'New Partner');

    const updateResponse = await jsonRequest(server.baseUrl, `/api/partners/${partner._id}`, 'PUT', { abbr: 'UP' }, authHeader());
    assert.equal(updateResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(updateResponse)).abbr, 'UP');

    const deleteResponse = await fetch(`${server.baseUrl}/api/partners/${partner._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
