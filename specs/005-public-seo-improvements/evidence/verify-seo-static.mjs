import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const evidenceDir = path.join(repoRoot, 'specs/005-public-seo-improvements/evidence')
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope=')) || '--scope=us1'
const scope = scopeArg.split('=')[1]

const requiredRoutes = ['/', '/about', '/projects', '/projects/:id', '/services', '/hse', '/careers', '/contact']
const sitemapRoutes = ['/', '/about', '/projects', '/services', '/hse', '/careers', '/contact']
const socialProfileKeys = ['home', 'about', 'projects', 'services', 'hse', 'careers', 'contact']
const privateRoutePattern = /(dashboard|admin|login|\/api|private)/i
const productionBaseUrl = 'https://fortuneconstruction.mw'

function readIfExists(relPath) {
  const abs = path.join(repoRoot, relPath)
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : ''
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath))
}

function add(results, name, pass, details = {}) {
  results.push({ name, pass, ...details })
}

const router = readIfExists('src/router.tsx')
const indexHtml = readIfExists('index.html')
const seoSource = readIfExists('src/lib/seo.ts')
const appSource = readIfExists('src/App.tsx')
const pages = {
  '/about': readIfExists('src/pages/AboutPage.tsx'),
  '/projects': readIfExists('src/pages/ProjectsPage.tsx'),
  '/projects/:id': readIfExists('src/pages/ProjectDetailsPage.tsx'),
  '/services': readIfExists('src/pages/ServicesPage.tsx'),
  '/hse': readIfExists('src/pages/HSEPage.tsx'),
  '/careers': readIfExists('src/pages/CareersPage.tsx'),
  '/contact': readIfExists('src/pages/ContactPage.tsx'),
}

const results = []

add(results, 'index.html has fallback title', /<title>[^<]+<\/title>/.test(indexHtml))
add(results, 'index.html has fallback description', /<meta\s+name=["']description["']/i.test(indexHtml))
add(results, 'router has /services route', /path:\s*['"]services['"]/.test(router))

for (const route of requiredRoutes) {
  if (route === '/') {
    add(results, `SEO profile exists for ${route}`, /homeSeo|routeSeoProfiles|SEO_PROFILES|seoProfiles/.test(seoSource) && /<SeoHead/.test(appSource))
    continue
  }
  const source = pages[route] || ''
  add(results, `SEO profile applied for ${route}`, /<SeoHead/.test(source))
}

add(results, 'canonical helper exists', /buildCanonicalUrl|canonical/i.test(seoSource))
add(results, 'canonical helper uses non-localhost production fallback', /https:\/\/fortuneconstruction\.mw/.test(seoSource))
add(results, 'canonical helper guards localhost production output', /localhost|127\.0\.0\.1/.test(seoSource) && /fallback|production|public/i.test(seoSource))
add(results, 'SeoHead component exists', exists('src/components/SeoHead.tsx'))

if (scope === 'us2-before' || scope === 'us2-after' || scope === 'all') {
  add(results, 'SocialPreviewProfile type exists', /interface\s+SocialPreviewProfile|type\s+SocialPreviewProfile/.test(seoSource))
  add(results, 'SeoProfile has typed social metadata field', /social:\s*SocialPreviewProfile/.test(seoSource))
  for (const key of socialProfileKeys) {
    const profilePattern = new RegExp(`${key}:\\s*{[\\s\\S]*?social:\\s*socialPreview\\(`, 'm')
    add(results, `social metadata profile exists for ${key}`, profilePattern.test(seoSource))
  }
  add(results, 'project detail social metadata builder exists', /projectSocialPreview|social:\s*projectSocialPreview/.test(seoSource))
  add(results, 'SeoHead emits OG URL and image from social metadata', /profile\.social/.test(readIfExists('src/components/SeoHead.tsx')) && /og:url/.test(readIfExists('src/components/SeoHead.tsx')) && /twitter:image/.test(readIfExists('src/components/SeoHead.tsx')))
}

if (scope === 'baseline' || scope === 'us3-before' || scope === 'us3-after' || scope === 'all') {
  const sitemap = readIfExists('public/sitemap.xml')
  const robots = readIfExists('public/robots.txt')
  add(results, 'sitemap exists', Boolean(sitemap), { deferredUntil: 'US3' })
  add(results, 'robots exists', Boolean(robots), { deferredUntil: 'US3' })
  if (sitemap) {
    for (const route of sitemapRoutes) {
      const url = route === '/' ? `${productionBaseUrl}/` : `${productionBaseUrl}${route}`
      add(results, `sitemap includes ${route}`, sitemap.includes(`<loc>${url}</loc>`))
    }
    add(results, 'sitemap excludes private routes', !privateRoutePattern.test(sitemap))
    add(results, 'sitemap does not use localhost', !/localhost|127\.0\.0\.1/.test(sitemap))
    add(results, 'sitemap uses production canonical base URL', sitemapRoutes.every((route) => {
      const url = route === '/' ? `${productionBaseUrl}/` : `${productionBaseUrl}${route}`
      return sitemap.includes(`<loc>${url}</loc>`)
    }))
  }
  if (robots) {
    add(results, 'robots allows public site', /allow:\s*\/\s*$/im.test(robots))
    add(results, 'robots disallows dashboard', /disallow:\s*\/dashboard/i.test(robots))
    add(results, 'robots disallows login', /disallow:\s*\/login/i.test(robots))
    add(results, 'robots disallows admin', /disallow:\s*\/admin/i.test(robots))
    add(results, 'robots disallows api', /disallow:\s*\/api/i.test(robots))
    add(results, 'robots disallows private management', /disallow:\s*\/private/i.test(robots) && /disallow:\s*\/management/i.test(robots))
    add(results, 'robots references production sitemap', new RegExp(`sitemap:\\s*${productionBaseUrl.replace(/\./g, '\\.')}/sitemap\\.xml`, 'i').test(robots))
    add(results, 'robots does not use localhost', !/localhost|127\.0\.0\.1/.test(robots))
  }
}

const failed = results.filter((result) => !result.pass)
const outFile = scope === 'all'
  ? 'seo-static-results.json'
  : scope === 'baseline'
  ? 'seo-static-baseline.json'
  : scope === 'us1-before'
    ? 'seo-static-us1-before.json'
    : scope === 'us2-before'
      ? 'seo-static-us2-before.json'
      : scope === 'us2-after'
        ? 'seo-static-us2-after.json'
        : scope === 'us3-before'
          ? 'seo-static-us3-before.json'
          : scope === 'us3-after'
            ? 'seo-static-us3-after.json'
            : 'seo-static-us1-after.json'

fs.mkdirSync(evidenceDir, { recursive: true })
fs.writeFileSync(path.join(evidenceDir, outFile), JSON.stringify({ scope, results, failed }, null, 2))
console.log(JSON.stringify({ scope, total: results.length, failed: failed.length, failedNames: failed.map((item) => item.name), output: outFile }, null, 2))

if (failed.length) process.exitCode = 1
