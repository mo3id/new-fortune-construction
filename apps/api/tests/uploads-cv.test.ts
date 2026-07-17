import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { filePart, oversizedFilePart, postMultipart } from './helpers/uploadTestHelpers';

interface ApplicationBody {
  message?: string;
  id?: string;
  code?: string;
}

function appendApplicationFields(form: FormData): void {
  form.append('fullName', 'Test Applicant');
  form.append('email', 'applicant@example.com');
  form.append('phone', '+265123456789');
  form.append('position', 'Civil Engineer');
  form.append('coverLetter', 'I am interested in this role.');
}

test('CV upload accepts valid PDF and preserves application response shape', async () => {
  const originalCreate = JobApplication.create;
  let capturedCvFile: string | undefined;
  JobApplication.create = (async (payload: { cvFile?: string }) => {
    capturedCvFile = payload.cvFile;
    return { _id: '507f1f77bcf86cd799439012' };
  }) as typeof JobApplication.create;

  const server = await createTestServer();
  const form = new FormData();
  appendApplicationFields(form);
  form.append('cvFile', filePart('pdf-bytes', 'application/pdf'), '../../Unsafe CV.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ApplicationBody;

    assert.equal(response.status, 201);
    assert.deepEqual(body, {
      message: 'Application submitted successfully',
      id: '507f1f77bcf86cd799439012',
    });
    assert.match(capturedCvFile ?? '', /^\/uploads\/cvs\/[a-z0-9-]+\.pdf$/);
    assert.equal(capturedCvFile?.includes('..'), false);
    assert.equal(capturedCvFile?.includes(' '), false);
  } finally {
    await server.close();
    JobApplication.create = originalCreate;
  }
});

test('CV upload rejects mismatched MIME and extension', async () => {
  const server = await createTestServer();
  const form = new FormData();
  appendApplicationFields(form);
  form.append('cvFile', filePart('not-pdf', 'image/png'), 'resume.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ApplicationBody;

    assert.equal(response.status, 400);
    assert.equal(body.code, 'UPLOAD_VALIDATION_ERROR');
  } finally {
    await server.close();
  }
});

test('CV upload rejects files over the configured CV size limit', async () => {
  const server = await createTestServer();
  const form = new FormData();
  appendApplicationFields(form);
  form.append('cvFile', oversizedFilePart(5 * 1024 * 1024 + 1, 'application/pdf'), 'large.pdf');

  try {
    const response = await postMultipart(server.baseUrl, '/api/applications/submit', form);
    const body = (await response.json()) as ApplicationBody;

    assert.equal(response.status, 400);
    assert.equal(body.code, 'UPLOAD_VALIDATION_ERROR');
  } finally {
    await server.close();
  }
});
