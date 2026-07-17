import './setup';
import test from 'node:test';
import { assertContains, readRepoFile } from './helpers/staticFileAssertions';

test('public website consumers declare project and category dependencies', () => {
  const home = readRepoFile('src/App.tsx');
  const projects = readRepoFile('src/pages/ProjectsPage.tsx');
  const details = readRepoFile('src/pages/ProjectDetailsPage.tsx');

  assertContains(home, /apiFetch<RawProject\[\]>\('\/projects'\)/, 'Home page must fetch public projects');
  assertContains(projects, /apiFetch<RawProject\[\]>\('\/projects'\)/, 'Projects page must fetch public projects');
  assertContains(projects, /apiFetch<ProjectCategoryOption\[\]>\('\/project-categories'\)/, 'Projects page must fetch project categories');
  assertContains(details, /apiFetch<RawProject>\(`\/projects\/\$\{id\}`\)/, 'Project details page must fetch project by id');
});

test('public website consumers declare service, partner, team, jobs, settings, and page content dependencies', () => {
  assertContains(readRepoFile('src/components/Services.tsx'), /apiFetch<ApiService\[\]>\('\/services'\)/, 'Services section must fetch services');
  assertContains(readRepoFile('src/components/Partners.tsx'), /apiFetch<ApiPartner\[\]>\('\/partners'\)/, 'Partners section must fetch partners');
  assertContains(readRepoFile('src/components/PartnersSection.tsx'), /apiFetch<ApiPartner\[\]>\('\/partners'\)/, 'Partners logo section must fetch partners');
  assertContains(readRepoFile('src/pages/AboutPage.tsx'), /apiFetch<ApiTeamMember\[\]>\('\/team'\)/, 'About page must fetch team members');
  assertContains(readRepoFile('src/pages/CareersPage.tsx'), /apiFetch<ApiJob\[\]>\('\/jobs'\)/, 'Careers page must fetch jobs');

  for (const file of [
    'src/components/Hero.tsx',
    'src/components/Footer.tsx',
    'src/pages/ContactPage.tsx',
    'src/components/contact/ContactInfo.tsx',
    'src/components/footer/FooterMap.tsx',
  ]) {
    assertContains(readRepoFile(file), /apiFetch<SiteSettings>\('\/settings'\)/, `${file} must fetch settings`);
  }

  assertContains(readRepoFile('src/hooks/usePageContent.ts'), /apiFetch<T>\(`\/content\/\$\{page\}`\)/, 'usePageContent must fetch page content');
});

test('public website form consumers submit messages and applications without dashboard contract changes', () => {
  assertContains(readRepoFile('src/components/contact/ContactForm.tsx'), /fetch\(`\$\{API\}\/messages\/submit`/, 'Contact form must submit messages');
  assertContains(readRepoFile('src/components/ApplicationForm.tsx'), /fetch\(`\$\{API\}\/applications\/submit`/, 'Application form must submit applications');
});

test('success stories public consumer uses home page content management path', () => {
  const partners = readRepoFile('src/components/Partners.tsx');

  assertContains(partners, /usePageContent<\{\s*successStories\?:\s*SuccessStoriesContent\s*\}>\('home'\)/, 'Partners section must read success stories from home page content');
  assertContains(partners, /homeContent\?\.successStories/, 'Partners section must use successStories section from page content');
});
