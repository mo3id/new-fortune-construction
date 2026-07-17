import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Project from '../src/models/Project';
import ProjectCategory from '../src/models/ProjectCategory';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, categoryFixture, jsonRequest } from './helpers/projectCategoryTestHelpers';

test('deleting category used by projects disables it without deleting project category strings', async () => {
  const originalFindById = ProjectCategory.findById;
  const originalCountDocuments = Project.countDocuments;
  const category = {
    ...categoryFixture({ name: 'Roads' }),
    save: async () => category,
  };

  ProjectCategory.findById = ((async () => category) as unknown) as typeof ProjectCategory.findById;
  Project.countDocuments = (async () => 2) as typeof Project.countDocuments;

  const server = await createTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/api/project-categories/${category._id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    const body = (await response.json()) as { message?: string; category?: { isActive?: boolean; name?: string } };

    assert.equal(response.status, 200);
    assert.equal(body.message, 'Category disabled because it is used by projects');
    assert.equal(body.category?.name, 'Roads');
    assert.equal(body.category?.isActive, false);
  } finally {
    await server.close();
    ProjectCategory.findById = originalFindById;
    Project.countDocuments = originalCountDocuments;
  }
});

test('renaming a category updates existing Project.category string values', async () => {
  const originalFindById = ProjectCategory.findById;
  const originalFindByIdAndUpdate = ProjectCategory.findByIdAndUpdate;
  const originalUpdateMany = Project.updateMany;
  const existing = categoryFixture({ name: 'Roads', slug: 'roads' });
  let capturedProjectUpdate: { filter?: unknown; update?: unknown } = {};

  ProjectCategory.findById = ((async () => existing) as unknown) as typeof ProjectCategory.findById;
  ProjectCategory.findByIdAndUpdate = ((async (_id: string, payload: Partial<typeof existing>) => ({
    ...existing,
    ...payload,
  })) as unknown) as typeof ProjectCategory.findByIdAndUpdate;
  Project.updateMany = ((async (filter: unknown, update: unknown) => {
    capturedProjectUpdate = { filter, update };
    return { modifiedCount: 3 };
  }) as unknown) as typeof Project.updateMany;

  const server = await createTestServer();

  try {
    const response = await jsonRequest(
      server.baseUrl,
      `/api/project-categories/${existing._id}`,
      'PUT',
      { name: 'Transport' },
      authHeader()
    );
    const body = (await response.json()) as { name?: string };

    assert.equal(response.status, 200);
    assert.equal(body.name, 'Transport');
    assert.deepEqual(capturedProjectUpdate.filter, { category: 'Roads' });
    assert.deepEqual(capturedProjectUpdate.update, { $set: { category: 'Transport' } });
  } finally {
    await server.close();
    ProjectCategory.findById = originalFindById;
    ProjectCategory.findByIdAndUpdate = originalFindByIdAndUpdate;
    Project.updateMany = originalUpdateMany;
  }
});
