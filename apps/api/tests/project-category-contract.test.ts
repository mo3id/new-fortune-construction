import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Project from '../src/models/Project';
import { createTestServer } from './helpers/appTestHarness';
import { projectFixture } from './helpers/projectIntegrationTestHelpers';

test('public project read keeps Project.category as a string contract', async () => {
  const originalFind = Project.find;
  const projects = [projectFixture({ category: 'Roads' })];

  Project.find = (() => ({
    sort: async () => projects,
  })) as unknown as typeof Project.find;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/projects`);
    const body = (await response.json()) as Array<{ category?: unknown }>;

    assert.equal(response.status, 200);
    assert.equal(typeof body[0].category, 'string');
    assert.equal(body[0].category, 'Roads');
    assert.equal(Object.prototype.hasOwnProperty.call(body[0], 'categoryId'), false);
  } finally {
    await server.close();
    Project.find = originalFind;
  }
});
