import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import ContactMessage from '../src/models/ContactMessage';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, jsonRequest } from './helpers/projectCategoryTestHelpers';
import { readJson, replaceStatic, restoreAll, sortedResult } from './helpers/contractTestHelpers';

const message = {
  _id: '507f1f77bcf86cd799439801',
  name: 'Visitor',
  email: 'visitor@example.test',
  phone: '+265 123',
  message: 'Hello',
  isRead: false,
};

const application = {
  _id: '507f1f77bcf86cd799439901',
  fullName: 'Applicant',
  email: 'applicant@example.test',
  phone: '+265 456',
  position: 'Site Engineer',
  coverLetter: 'Please consider me.',
  status: 'new',
};

test('messages public submit and dashboard read/update/delete contracts stay compatible', async () => {
  const restores = [
    replaceStatic(ContactMessage, 'create', async (body: object) => ({ ...message, ...body })),
    replaceStatic(ContactMessage, 'find', () => sortedResult([message])),
    replaceStatic(ContactMessage, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...message, ...body })),
    replaceStatic(ContactMessage, 'findByIdAndDelete', async () => message),
  ];
  const server = await createTestServer();

  try {
    const submitResponse = await jsonRequest(server.baseUrl, '/api/messages/submit', 'POST', { name: 'Visitor', email: 'visitor@example.test', message: 'Hello' });
    assert.equal(submitResponse.status, 201);
    assert.deepEqual(await readJson(submitResponse), { message: 'Message sent successfully' });

    const listResponse = await fetch(`${server.baseUrl}/api/messages?isRead=false`, { headers: authHeader() });
    const list = await readJson<Array<Record<string, unknown>>>(listResponse);
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(list), true);
    assert.equal(list[0].isRead, false);

    const readResponse = await fetch(`${server.baseUrl}/api/messages/${message._id}/read`, { method: 'PATCH', headers: authHeader() });
    assert.equal(readResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(readResponse)).isRead, true);

    const deleteResponse = await fetch(`${server.baseUrl}/api/messages/${message._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});

test('applications public submit and dashboard list/status/delete contracts stay compatible', async () => {
  const restores = [
    replaceStatic(JobApplication, 'create', async (body: object) => ({ ...application, ...body })),
    replaceStatic(JobApplication, 'find', () => sortedResult([application])),
    replaceStatic(JobApplication, 'findByIdAndUpdate', async (_id: string, body: object) => ({ ...application, ...body })),
    replaceStatic(JobApplication, 'findByIdAndDelete', async () => application),
  ];
  const server = await createTestServer();

  try {
    const form = new FormData();
    form.set('fullName', 'Applicant');
    form.set('email', 'applicant@example.test');
    form.set('phone', '+265 456');
    form.set('position', 'Site Engineer');
    form.set('coverLetter', 'Please consider me.');

    const submitResponse = await fetch(`${server.baseUrl}/api/applications/submit`, { method: 'POST', body: form });
    const submitBody = await readJson<Record<string, unknown>>(submitResponse);
    assert.equal(submitResponse.status, 201);
    assert.equal(submitBody.message, 'Application submitted successfully');
    assert.equal(submitBody.id, application._id);

    const listResponse = await fetch(`${server.baseUrl}/api/applications?status=new`, { headers: authHeader() });
    const list = await readJson<Array<Record<string, unknown>>>(listResponse);
    assert.equal(listResponse.status, 200);
    assert.equal(Array.isArray(list), true);
    assert.equal(list[0].status, 'new');

    const statusResponse = await jsonRequest(server.baseUrl, `/api/applications/${application._id}/status`, 'PATCH', { status: 'reviewed' }, authHeader());
    assert.equal(statusResponse.status, 200);
    assert.equal((await readJson<Record<string, unknown>>(statusResponse)).status, 'reviewed');

    const deleteResponse = await fetch(`${server.baseUrl}/api/applications/${application._id}`, { method: 'DELETE', headers: authHeader() });
    assert.deepEqual(await readJson(deleteResponse), { message: 'Deleted' });
  } finally {
    await server.close();
    restoreAll(restores);
  }
});
