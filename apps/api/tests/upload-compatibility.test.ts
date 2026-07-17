import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import JobApplication from '../src/models/JobApplication';
import { createTestServer } from './helpers/appTestHarness';
import { authHeader, filePart, postMultipart } from './helpers/uploadTestHelpers';

interface ImageUploadBody {
  url: string;
  type: string;
}

interface ApplicationBody {
  message: string;
  id: string;
}

function applicationForm(): FormData {
  const form = new FormData();
  form.append('fullName', 'Compatibility Applicant');
  form.append('email', 'compat@example.com');
  form.append('phone', '+265123456789');
  form.append('position', 'Project Manager');
  form.append('coverLetter', 'Compatibility test.');
  form.append('cvFile', filePart('pdf-bytes', 'application/pdf'), 'compat.pdf');
  return form;
}

test('upload response shapes remain compatible for image, video, and CV flows', async () => {
  const originalCreate = JobApplication.create;
  JobApplication.create = (async () => ({ _id: '507f1f77bcf86cd799439013' }) as unknown) as typeof JobApplication.create;

  const server = await createTestServer();

  try {
    const imageForm = new FormData();
    imageForm.append('image', filePart('image-bytes', 'image/png'), 'compat.png');
    const imageResponse = await postMultipart(server.baseUrl, '/api/upload', imageForm, authHeader());
    const imageBody = (await imageResponse.json()) as ImageUploadBody;

    assert.equal(imageResponse.status, 200);
    assert.deepEqual(Object.keys(imageBody).sort(), ['type', 'url']);
    assert.equal(imageBody.type, 'image');
    assert.match(imageBody.url, /^\/uploads\/images\/.+\.png$/);

    const videoForm = new FormData();
    videoForm.append('video', filePart('video-bytes', 'video/mp4'), 'compat.mp4');
    const videoResponse = await postMultipart(server.baseUrl, '/api/upload/video', videoForm, authHeader());
    const videoBody = (await videoResponse.json()) as ImageUploadBody;

    assert.equal(videoResponse.status, 200);
    assert.deepEqual(Object.keys(videoBody).sort(), ['type', 'url']);
    assert.equal(videoBody.type, 'video');
    assert.match(videoBody.url, /^\/uploads\/videos\/.+\.mp4$/);

    const cvResponse = await postMultipart(server.baseUrl, '/api/applications/submit', applicationForm());
    const cvBody = (await cvResponse.json()) as ApplicationBody;

    assert.equal(cvResponse.status, 201);
    assert.deepEqual(Object.keys(cvBody).sort(), ['id', 'message']);
    assert.equal(cvBody.message, 'Application submitted successfully');
    assert.equal(cvBody.id, '507f1f77bcf86cd799439013');
  } finally {
    await server.close();
    JobApplication.create = originalCreate;
  }
});
