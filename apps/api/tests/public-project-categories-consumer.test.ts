import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

test('public ProjectsPage consumes /project-categories without replacing string category filters', () => {
  const source = readRepoFile('src/pages/ProjectsPage.tsx');

  assertContains(source, /apiFetch<ProjectCategoryOption\[\]>\('\/project-categories'\)/, 'ProjectsPage must fetch public project categories');
  assertContains(source, /project\.category\s*===\s*category/, 'ProjectsPage must keep string category filter comparison');
  assert.equal(/categoryId/.test(source), false);
});
