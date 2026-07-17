import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

test('dashboard Projects page loads active category names for project form selector', () => {
  const source = readRepoFile('apps/dashboard/src/pages/Projects.tsx');

  assertContains(source, /api\.get\('\/project-categories'\)/, 'Dashboard Projects page must fetch project categories');
  assertContains(source, /\.filter\(\(category\)\s*=>\s*category\.isActive\)/, 'Dashboard Projects page should keep active-only category selector behavior');
  assertContains(source, /value:\s*category\.name/, 'Dashboard Projects page must submit category name string values');
  assert.equal(/categoryId/.test(source), false);
});
