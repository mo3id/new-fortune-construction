import './setup';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

const dashboardPages = [
  { label: 'projects', component: 'Projects', importPath: './pages/Projects', route: 'projects', sidebar: '/projects' },
  { label: 'project categories', component: 'ProjectCategories', importPath: './pages/ProjectCategories', route: 'project-categories', sidebar: '/project-categories' },
  { label: 'services', component: 'Services', importPath: './pages/Services', route: 'services', sidebar: '/services' },
  { label: 'team', component: 'Team', importPath: './pages/Team', route: 'team', sidebar: '/team' },
  { label: 'partners', component: 'Partners', importPath: './pages/Partners', route: 'partners', sidebar: '/partners' },
  { label: 'jobs', component: 'Jobs', importPath: './pages/Jobs', route: 'jobs', sidebar: '/jobs' },
  { label: 'applications', component: 'Applications', importPath: './pages/Applications', route: 'applications', sidebar: '/applications' },
  { label: 'messages', component: 'Messages', importPath: './pages/Messages', route: 'messages', sidebar: '/messages' },
  { label: 'page content', component: 'PageContent', importPath: './pages/PageContent', route: 'content', sidebar: '/content' },
  { label: 'settings', component: 'Settings', importPath: './pages/Settings', route: 'settings', sidebar: '/settings' },
];

test('dashboard registers management routes and sidebar links for existing public resource surfaces', () => {
  const appSource = readRepoFile('apps/dashboard/src/App.tsx');
  const sidebarSource = readRepoFile('apps/dashboard/src/components/Sidebar.tsx');

  for (const page of dashboardPages) {
    assertContains(
      appSource,
      new RegExp(`const\\s+${page.component}\\s*=\\s*lazy\\(\\(\\)\\s*=>\\s*import\\(['"]${page.importPath.replace('/', '\\/')}['"]\\)\\)`),
      `${page.label} dashboard page must be lazy imported`
    );
    assertContains(
      appSource,
      new RegExp(`path=["']${page.route}["']\\s+element=\\{withRouteFallback\\(<${page.component}\\s*\\/>\\)\\}`),
      `${page.label} dashboard route must be registered`
    );
    assertContains(sidebarSource, new RegExp(`to:\\s*['"]${page.sidebar.replace(/\//g, '\\/')}['"]`), `${page.label} sidebar link must exist`);
  }
});

test('success stories management path is documented through Page Content rather than a broad dashboard rewrite', () => {
  const pageContentSource = readRepoFile('apps/dashboard/src/pages/PageContent.tsx');
  const inventory = readRepoFile('specs/003-api-integration-repair/integration-inventory.md');

  assertContains(pageContentSource, /'Success Stories':\s*'successStories'/, 'Page Content must map Success Stories to successStories');
  assertContains(pageContentSource, /label:\s*['"]Success Stories['"]/, 'Page Content must expose Success Stories fields');
  assertContains(inventory, /Success stories/i, 'Inventory must document Success stories');
  assertContains(inventory, /Dashboard gap|Accepted management path/i, 'Inventory must classify the Success stories management status');
});
