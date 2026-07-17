import './setup';
import assert from 'node:assert/strict';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

const apiResources = [
  { name: 'projects', routeVar: 'projectRoutes', importPath: './routes/projects', mount: '/api/projects' },
  { name: 'services', routeVar: 'serviceRoutes', importPath: './routes/services', mount: '/api/services' },
  { name: 'partners', routeVar: 'partnerRoutes', importPath: './routes/partners', mount: '/api/partners' },
  { name: 'team', routeVar: 'teamRoutes', importPath: './routes/team', mount: '/api/team' },
  { name: 'jobs', routeVar: 'jobRoutes', importPath: './routes/jobs', mount: '/api/jobs' },
  { name: 'settings', routeVar: 'settingsRoutes', importPath: './routes/settings', mount: '/api/settings' },
  { name: 'page content', routeVar: 'pageContentRoutes', importPath: './routes/pageContent', mount: '/api/content' },
  { name: 'messages', routeVar: 'messageRoutes', importPath: './routes/messages', mount: '/api/messages' },
  { name: 'applications', routeVar: 'applicationRoutes', importPath: './routes/applications', mount: '/api/applications' },
  { name: 'success stories', routeVar: 'successStoryRoutes', importPath: './routes/successStories', mount: '/api/success-stories' },
  { name: 'project categories', routeVar: 'projectCategoryRoutes', importPath: './routes/projectCategories', mount: '/api/project-categories' },
];

test('public resource API routes are imported and mounted', () => {
  const source = readRepoFile('apps/api/src/index.ts');

  for (const resource of apiResources) {
    assertContains(
      source,
      new RegExp(`import\\s+${resource.routeVar}\\s+from\\s+['"]${resource.importPath.replace('/', '\\/')}['"]`),
      `${resource.name} route must be imported`
    );
    assertContains(
      source,
      new RegExp(`app\\.use\\(['"]${resource.mount.replace(/\//g, '\\/')}['"],\\s*${resource.routeVar}\\)`),
      `${resource.name} route must be mounted at ${resource.mount}`
    );
  }
});

test('integration inventory records every public resource and explicit success stories status', () => {
  const inventory = readRepoFile('specs/003-api-integration-repair/integration-inventory.md');

  const expectedResources = [
    'Projects',
    'Services',
    'Partners',
    'Team',
    'Jobs',
    'Settings',
    'Page content',
    'Messages',
    'Applications',
    'Success stories',
    'Project categories',
  ];

  for (const resource of expectedResources) {
    assertContains(inventory, new RegExp(`\\|\\s*${resource}\\s*\\|`, 'i'), `${resource} must be included in the inventory table`);
  }

  assert.match(inventory, /Success stories/i);
  assert.match(inventory, /Dashboard gap|Accepted management path/i);
  assert.doesNotMatch(inventory, /TBD|TODO|placeholder/i);
});
