import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import Project from '../src/models/Project';
import ProjectCategory from '../src/models/ProjectCategory';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, categoryFixture, jsonRequest } from './helpers/projectCategoryTestHelpers';

test('project category write routes require dashboard auth token', async () => {
  const server = await createTestServer();

  try {
    const response = await jsonRequest(server.baseUrl, '/api/project-categories', 'POST', { name: 'Roads' });
    const body = (await response.json()) as { message?: string };

    assert.equal(response.status, 401);
    assert.equal(body.message, 'No token provided');
  } finally {
    await server.close();
  }
});

test('project category create/list/update/delete unused category preserves response shapes', async () => {
  const originalCountDocuments = ProjectCategory.countDocuments;
  const originalFind = ProjectCategory.find;
  const originalCreate = ProjectCategory.create;
  const originalFindById = ProjectCategory.findById;
  const originalFindByIdAndUpdate = ProjectCategory.findByIdAndUpdate;
  const originalProjectCountDocuments = Project.countDocuments;

  const created = categoryFixture({ name: 'Healthcare', slug: 'healthcare', icon: 'Layers3', order: 7 });
  const updated = categoryFixture({ ...created, icon: 'Building2', order: 8 });
  let deleted = false;

  ProjectCategory.countDocuments = (async () => 1) as typeof ProjectCategory.countDocuments;
  ProjectCategory.find = (() => ({
    sort: async () => [created],
  })) as unknown as typeof ProjectCategory.find;
  ProjectCategory.create = ((async (payload: Partial<typeof created>) => ({
    ...created,
    ...payload,
  })) as unknown) as typeof ProjectCategory.create;
  ProjectCategory.findById = ((async () => ({
    ...created,
    deleteOne: async () => {
      deleted = true;
    },
  })) as unknown) as typeof ProjectCategory.findById;
  ProjectCategory.findByIdAndUpdate = ((async (_id: string, payload: Partial<typeof updated>) => ({
    ...updated,
    ...payload,
  })) as unknown) as typeof ProjectCategory.findByIdAndUpdate;
  Project.countDocuments = (async () => 0) as typeof Project.countDocuments;

  const server = await createTestServer();

  try {
    const createResponse = await jsonRequest(
      server.baseUrl,
      '/api/project-categories',
      'POST',
      { name: 'Healthcare', slug: '', order: 7 },
      authHeader()
    );
    const createBody = (await createResponse.json()) as { name?: string; slug?: string };
    assert.equal(createResponse.status, 201);
    assert.equal(createBody.name, 'Healthcare');
    assert.equal(createBody.slug, 'healthcare');

    const listResponse = await fetch(`${server.baseUrl}/api/project-categories`);
    const listBody = (await listResponse.json()) as Array<{ name?: string }>;
    assert.equal(listResponse.status, 200);
    assert.equal(listBody[0].name, 'Healthcare');

    const updateResponse = await jsonRequest(
      server.baseUrl,
      `/api/project-categories/${created._id}`,
      'PUT',
      { icon: 'Building2', order: 8 },
      authHeader()
    );
    const updateBody = (await updateResponse.json()) as { icon?: string; order?: number };
    assert.equal(updateResponse.status, 200);
    assert.equal(updateBody.icon, 'Building2');
    assert.equal(updateBody.order, 8);

    const deleteResponse = await fetch(`${server.baseUrl}/api/project-categories/${created._id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    const deleteBody = (await deleteResponse.json()) as { message?: string };
    assert.equal(deleteResponse.status, 200);
    assert.equal(deleteBody.message, 'Category deleted');
    assert.equal(deleted, true);
  } finally {
    await server.close();
    ProjectCategory.countDocuments = originalCountDocuments;
    ProjectCategory.find = originalFind;
    ProjectCategory.create = originalCreate;
    ProjectCategory.findById = originalFindById;
    ProjectCategory.findByIdAndUpdate = originalFindByIdAndUpdate;
    Project.countDocuments = originalProjectCountDocuments;
  }
});

test('project category validation returns existing API validation error shape', async () => {
  const server = await createTestServer();

  try {
    const response = await jsonRequest(server.baseUrl, '/api/project-categories', 'POST', { name: '' }, authHeader());
    const body = (await response.json()) as { message?: string; code?: string; details?: Array<{ field?: string }> };

    assert.equal(response.status, 400);
    assert.equal(body.message, 'Invalid request');
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.details?.some((detail) => detail.field === 'name'));
  } finally {
    await server.close();
  }
});
