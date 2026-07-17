import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import ProjectCategory from '../src/models/ProjectCategory';
import { createTestServer } from './helpers/appTestHarness';
import { categoryFixture } from './helpers/projectCategoryTestHelpers';

test('GET /api/project-categories is mounted and returns category array shape', async () => {
  const originalCountDocuments = ProjectCategory.countDocuments;
  const originalFind = ProjectCategory.find;
  const originalInsertMany = ProjectCategory.insertMany;
  const categories = [categoryFixture()];
  let insertedDefaults = false;

  ProjectCategory.countDocuments = (async () => 1) as typeof ProjectCategory.countDocuments;
  ProjectCategory.insertMany = ((async () => {
    insertedDefaults = true;
    return [];
  }) as unknown) as typeof ProjectCategory.insertMany;
  ProjectCategory.find = (() => ({
    sort: async () => categories,
  })) as unknown as typeof ProjectCategory.find;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/project-categories`);
    const body = (await response.json()) as Array<{ name?: string; slug?: string; isActive?: boolean }>;

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body), true);
    assert.equal(body[0].name, 'Roads');
    assert.equal(body[0].slug, 'roads');
    assert.equal(body[0].isActive, true);
    assert.equal(insertedDefaults, false);
  } finally {
    await server.close();
    ProjectCategory.countDocuments = originalCountDocuments;
    ProjectCategory.find = originalFind;
    ProjectCategory.insertMany = originalInsertMany;
  }
});
