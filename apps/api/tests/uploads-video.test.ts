import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { uploadPolicies } from '../src/config/uploadPolicy';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, filePart, oversizedFilePart, postMultipart } from './helpers/uploadTestHelpers';

interface UploadBody {
  url?: string;
  type?: string;
  code?: string;
}

test('video upload accepts valid video MIME and extension with sanitized filename', async () => {
  const server = await createTestServer();
  const form = new FormData();
  form.append('video', filePart('video-bytes', 'video/mp4'), '../Site Walkthrough.mp4');

  try {
    const response = await postMultipart(server.baseUrl, '/api/upload/video', form, authHeader());
    const body = (await response.json()) as UploadBody;

    assert.equal(response.status, 200);
    assert.equal(body.type, 'video');
    assert.match(body.url ?? '', /^\/uploads\/videos\/[a-z0-9-]+\.mp4$/);
    assert.equal(body.url?.includes('..'), false);
    assert.equal(body.url?.includes(' '), false);
  } finally {
    await server.close();
  }
});

test('video upload rejects mismatched MIME and extension', async () => {
  const server = await createTestServer();
  const form = new FormData();
  form.append('video', filePart('not-video', 'image/png'), 'clip.mp4');

  try {
    const response = await postMultipart(server.baseUrl, '/api/upload/video', form, authHeader());
    const body = (await response.json()) as UploadBody;

    assert.equal(response.status, 400);
    assert.equal(body.code, 'UPLOAD_VALIDATION_ERROR');
  } finally {
    await server.close();
  }
});

test('video upload rejects files over the configured video size limit', async () => {
  const server = await createTestServer();
  const form = new FormData();
  form.append('video', oversizedFilePart(uploadPolicies.video.maxSizeBytes + 1, 'video/mp4'), 'large.mp4');

  try {
    const response = await postMultipart(server.baseUrl, '/api/upload/video', form, authHeader());
    const body = (await response.json()) as UploadBody;

    assert.equal(response.status, 400);
    assert.equal(body.code, 'UPLOAD_VALIDATION_ERROR');
  } finally {
    await server.close();
  }
});
