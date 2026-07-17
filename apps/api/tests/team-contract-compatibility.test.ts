import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import TeamMember from '../src/models/TeamMember';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll, sortedResult } from './helpers/contractTestHelpers';

const member = {
  _id: '507f1f77bcf86cd799439501',
  name: 'Grace Banda',
  role: 'Engineer',
  photo: '/uploads/images/grace.jpg',
  bio: 'Civil engineer',
  socialLinks: { linkedin: '', twitter: '' },
  order: 1,
};

test('team public list and dashboard mutations preserve current contracts', async () => {
  const restores = [
    replaceStatic(TeamMember, 'find', () => sortedResult([member])),
    replaceStatic(TeamMember, 'create', async (body: object) => ({ ...member, ...body })),
    replaceStatic(TeamMember, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...member, ...body })),
    replaceStatic(TeamMember, 'findByIdAndDelete', async () => member),
  ];
  const server = await createTestServer();

  try {
    const listResponse = await fetch(`${server.baseUrl}/api/team`);
    const list = await readJson<Array<Record<string, unknown>>>(listResponse);
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(list), true);
    assert.equal(list[0].name, member.name);

    const createResponse = await jsonRequest(server.baseUrl, '/api/team', 'POST', { name: 'New Member', role: 'Manager' }, authHeader());
    assert.equal(createResponse.status, 201);
    assert.equal((await readJson<Record<string, unknown>>(createResponse)).name, 'New Member');

    const updateResponse = await jsonRequest(server.baseUrl, `/api/team/${member._id}`, 'PUT', { role: 'Director' }, authHeader());
    assert.equal(updateResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(updateResponse)).role, 'Director');

    const deleteResponse = await fetch(`${server.baseUrl}/api/team/${member._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
