import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

test('dashboard registers /project-categories route that matches sidebar link', () => {
  const appSource = readRepoFile('apps/dashboard/src/App.tsx');
  const sidebarSource = readRepoFile('apps/dashboard/src/components/Sidebar.tsx');

  assertContains(appSource, /const\s+ProjectCategories\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/ProjectCategories['"]\)\)/, 'ProjectCategories page must be lazy imported');
  assertContains(appSource, /path=["']project-categories["']\s+element=\{withRouteFallback\(<ProjectCategories\s*\/>\)\}/, 'Dashboard router must register project-categories route');
  assert.match(sidebarSource, /to:\s*['"]\/project-categories['"]/);
});
