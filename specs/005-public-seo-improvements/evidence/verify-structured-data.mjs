import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const repoRoot = process.cwd()
const evidenceDir = path.join(repoRoot, 'specs/005-public-seo-improvements/evidence')
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope=')) || '--scope=us4'
const scope = scopeArg.split('=')[1]
const baseArg = process.argv.find((arg) => arg.startsWith('--base='))
const base = (baseArg?.split('=')[1] || '').replace(/\/+$/, '')

const targets = [
  { name: 'home', route: '/', file: 'src/App.tsx', builder: 'organizationStructuredData', requiredType: 'Organization' },
  { name: 'contact', route: '/contact', file: 'src/pages/ContactPage.tsx', builder: 'contactStructuredData', requiredType: 'ContactPage' },
  { name: 'services', route: '/services', file: 'src/pages/ServicesPage.tsx', builder: 'servicesStructuredData', requiredType: 'Service' },
]

function readIfExists(relPath) {
  const abs = path.join(repoRoot, relPath)
  return fsSync.existsSync(abs) ? fsSync.readFileSync(abs, 'utf8') : ''
}

function add(results, name, pass, details = {}) {
  results.push({ name, pass, ...details })
}

function hasType(item, expected) {
  const type = item?.['@type']
  return Array.isArray(type) ? type.includes(expected) : type === expected
}

async function runSourceChecks() {
  const seoSource = readIfExists('src/lib/seo.ts')
  const results = []

  add(results, 'StructuredDataItem type exists', /type\s+StructuredDataItem|interface\s+StructuredDataItem/.test(seoSource))
  add(results, 'organization structured data builder exists', /function\s+organizationStructuredData/.test(seoSource))
  add(results, 'contact structured data builder exists', /function\s+contactStructuredData/.test(seoSource))
  add(results, 'services structured data builder exists', /function\s+servicesStructuredData/.test(seoSource))
  add(results, 'structured data uses schema.org context', /@context['"]?\s*:\s*['"]https:\/\/schema\.org/.test(seoSource))
  add(results, 'structured data uses known SITE constants', /from ['"]@\/lib\/constants['"]/.test(seoSource) && /SITE\./.test(seoSource))
  add(results, 'structured data includes visible service names', /Roads & Infrastructure/.test(seoSource) && /Building & Commercial Construction/.test(seoSource) && /Bridges & Structural Works/.test(seoSource))

  for (const target of targets) {
    const source = readIfExists(target.file)
    add(results, `${target.name} page wires ${target.builder}`, source.includes(target.builder) && /structuredData/.test(source))
  }

  return results
}

async function runBrowserChecks() {
  if (!base) return []

  const require = createRequire(import.meta.url)
  const { chromium } = require('/Users/mohamedeidali/Library/Caches/com.openai.codex/org.sparkle-project.Sparkle/Installation/4OX4kTEA7/EHi677UFs/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
  const results = []
  const raw = []

  for (const target of targets) {
    const page = await context.newPage()
    const consoleErrors = []
    const failedRequests = []
    page.on('console', (msg) => {
      if (['error', 'warning'].includes(msg.type())) consoleErrors.push(`${msg.type()}: ${msg.text()}`)
    })
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`)
    })

    let status = null
    let navError = null
    try {
      const response = await page.goto(`${base}${target.route}`, { waitUntil: 'domcontentloaded', timeout: 15_000 })
      status = response?.status() || null
      await page.waitForTimeout(1200)
    } catch (error) {
      navError = error instanceof Error ? error.message : String(error)
    }

    const jsonLd = await page.evaluate(() => Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((script) => script.textContent || '')
      .map((text) => {
        try {
          return JSON.parse(text)
        } catch (error) {
          return { parseError: error instanceof Error ? error.message : String(error), raw: text }
        }
      }))
      .catch((error) => [{ evaluateError: error instanceof Error ? error.message : String(error) }])

    const flattened = jsonLd.flatMap((item) => Array.isArray(item) ? item : [item])
    const hasRequiredType = flattened.some((item) => hasType(item, target.requiredType))
    const hasContext = flattened.every((item) => item['@context'] === 'https://schema.org')
    const hasNoParseErrors = flattened.every((item) => !item.parseError && !item.evaluateError)
    const text = JSON.stringify(flattened)

    add(results, `${target.name} route has JSON-LD`, flattened.length > 0, { status, navError })
    add(results, `${target.name} JSON-LD parses`, hasNoParseErrors)
    add(results, `${target.name} JSON-LD has schema.org context`, hasContext)
    add(results, `${target.name} JSON-LD includes ${target.requiredType}`, hasRequiredType)
    add(results, `${target.name} JSON-LD does not use localhost`, !/localhost|127\.0\.0\.1/.test(text))

    raw.push({
      target: target.name,
      route: target.route,
      status,
      navError,
      jsonLd: flattened,
      consoleErrors,
      failedRequests,
    })
    await page.close()
  }

  await context.close()
  await browser.close()
  await fs.writeFile(path.join(evidenceDir, 'structured-data-browser-results.json'), JSON.stringify(raw, null, 2))
  return results
}

await fs.mkdir(evidenceDir, { recursive: true })
const results = [
  ...(await runSourceChecks()),
  ...(await runBrowserChecks()),
]
const failed = results.filter((result) => !result.pass)
const outFile = scope === 'all' ? 'structured-data-results.json' : scope === 'us4-before' ? 'structured-data-us4-before.json' : 'structured-data-us4-after.json'
await fs.writeFile(path.join(evidenceDir, outFile), JSON.stringify({ scope, results, failed }, null, 2))
console.log(JSON.stringify({ scope, total: results.length, failed: failed.length, failedNames: failed.map((item) => item.name), output: outFile }, null, 2))
if (failed.length) process.exitCode = 1
