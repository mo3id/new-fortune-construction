import './setup';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { filePart, postMultipart } from './helpers/uploadTestHelpers';

interface ValidationBody {
  message?: string;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
  id?: string;
}

function validApplicationForm(): FormData {
  const form = new FormData();
  form.append('fullName', 'Website Applicant');
  form.append('email', 'website@example.com');
  form.append('phone', '+265123456789');
  form.append('position', 'Civil Engineer');
  form.append('coverLetter', 'I would like to apply.');
  return form;
}

const cvUploadDir = path.join(__dirname, '..', 'uploads', 'cvs');

function uploadedFilesContaining(marker: string): string[] {
  if (!fs.existsSync(cvUploadDir)) return [];
  return fs.readdirSync(cvUploadDir).filter((fileName) => fileName.includes(marker));
}

test('application submit rejects missing required fields with contract validation shape', async () => {
  const server = await createTestServer();
  const form = new FormData();
  form.append('fullName', '');
  form.append('email', 'not-an-email');
  form.append('phone', '');
  form.append('position', '');
  form.append('coverLetter', '');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 400);
    assert.equal(body.message, 'Invalid request');
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.details?.some((detail) => detail.field === 'fullName'));
    assert.ok(body.details?.some((detail) => detail.field === 'email'));
    assert.ok(body.details?.some((detail) => detail.field === 'phone'));
    assert.ok(body.details?.some((detail) => detail.field === 'position'));
    assert.ok(body.details?.some((detail) => detail.field === 'coverLetter'));
  } finally {
    await server.close();
  }
});

test('application submit removes uploaded CV when body validation fails', async () => {
  const server = await createTestServer();
  const form = new FormData();
  form.append('fullName', '');
  form.append('email', 'not-an-email');
  form.append('phone', '');
  form.append('position', '');
  form.append('coverLetter', '');
  form.append('cvFile', filePart('pdf-bytes', 'application/pdf'), 'validation-cleanup-marker.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 400);
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.deepEqual(uploadedFilesContaining('validation-cleanup-marker'), []);
  } finally {
    await server.close();
  }
});

test('application submit removes uploaded CV when create fails after upload', async () => {
  const originalCreate = JobApplication.create;
  JobApplication.create = (async () => {
    throw new Error('forced create failure');
  }) as typeof JobApplication.create;

  const server = await createTestServer();
  const form = validApplicationForm();
  form.append('cvFile', filePart('pdf-bytes', 'application/pdf'), 'async-cleanup-marker.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 500);
    assert.equal(body.code, 'INTERNAL_ERROR');
    assert.deepEqual(uploadedFilesContaining('async-cleanup-marker'), []);
  } finally {
    await server.close();
    JobApplication.create = originalCreate;
  }
});

test('application submit accepts current valid website payload shape', async () => {
  const originalCreate = JobApplication.create;
  let capturedPayload: { cvFile?: string; email?: string } | undefined;
  JobApplication.create = (async (payload: { cvFile?: string; email?: string }) => {
    capturedPayload = payload;
    return { _id: '507f1f77bcf86cd799439014' } as unknown;
  }) as typeof JobApplication.create;

  const server = await createTestServer();
  const form = validApplicationForm();
  form.append('cvFile', filePart('pdf-bytes', 'application/pdf'), 'resume.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ValidationBody;

    assert.equal(response.status, 201);
    assert.deepEqual(body, {
      message: 'Application submitted successfully',
      id: '507f1f77bcf86cd799439014',
    });
    assert.equal(capturedPayload?.email, 'website@example.com');
    assert.match(capturedPayload?.cvFile ?? '', /^\/uploads\/cvs\/.+\.pdf$/);
  } finally {
    await server.close();
    JobApplication.create = originalCreate;
  }
});
