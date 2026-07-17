import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import SiteSettings from '../src/models/SiteSettings';
import PageContent from '../src/models/PageContent';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll } from './helpers/contractTestHelpers';

const settings = {
  _id: '507f1f77bcf86cd799439701',
  companyName: 'Fortune Construction',
  email: 'info@example.test',
  phone: '+265 123',
};

test('settings public read and dashboard singleton update preserve object response shape', async () => {
  const restores = [
    replaceStatic(SiteSettings, 'findOne', async () => settings),
    replaceStatic(SiteSettings, 'create', async (body: object) => ({ ...settings, ...body })),
    replaceStatic(SiteSettings, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...settings, ...body })),
  ];
  const server = await createTestServer();

  try {
    const getResponse = await fetch(`${server.baseUrl}/api/settings`);
    const getBody = await readJson<Record<string, unknown>>(getResponse);
    assert.equal(getResponse.status, 200);
    assert.equal(getBody.companyName, settings.companyName);

    const updateResponse = await jsonRequest(server.baseUrl, '/api/settings', 'PUT', { companyName: 'Fortune Updated' }, authHeader());
    const updateBody = await readJson<Record<string, unknown>>(updateResponse);
    assert.equal(updateResponse.status, 200);
    assert.equal(updateBody.companyName, 'Fortune Updated');
  } finally {
    await server.close();
    restoreAll(restores);
  }
});

test('page content public reads and dashboard section update preserve section map and document contracts', async () => {
  const docs = [
    { page: 'home', section: 'hero', content: { title: 'Home Hero' } },
    { page: 'home', section: 'successStories', content: { items: [{ quote: 'Great work' }] } },
  ];
  const updatedDoc = { _id: '507f1f77bcf86cd799439702', page: 'home', section: 'hero', content: { title: 'Updated Hero' } };
  const restores = [
    replaceStatic(PageContent, 'find', async () => docs),
    replaceStatic(PageContent, 'findOne', async () => docs[0]),
    replaceStatic(PageContent, 'findOneAndUpdate', async () => updatedDoc),
  ];
  const server = await createTestServer();

  try {
    const pageResponse = await fetch(`${server.baseUrl}/api/content/home`);
    const pageBody = await readJson<Record<string, unknown>>(pageResponse);
    assert.equal(pageResponse.status, 200);
    assert.deepEqual(pageBody.hero, { title: 'Home Hero' });
    assert.deepEqual(pageBody.successStories, { items: [{ quote: 'Great work' }] });

    const sectionResponse = await fetch(`${server.baseUrl}/api/content/home/hero`);
    assert.deepEqual(await readJson(sectionResponse), { title: 'Home Hero' });

    const updateResponse = await jsonRequest(server.baseUrl, '/api/content/home/hero', 'PUT', { title: 'Updated Hero' }, authHeader());
    const updateBody = await readJson<Record<string, unknown>>(updateResponse);
    assert.equal(updateResponse.status, 200);
    assert.deepEqual(updateBody.content, { title: 'Updated Hero' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
