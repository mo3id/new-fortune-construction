import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('/Users/mohamedeidali/Library/Caches/com.openai.codex/org.sparkle-project.Sparkle/Installation/4OX4kTEA7/EHi677UFs/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')

const baseArg = process.argv.find((arg) => arg.startsWith('--base='))
const base = (baseArg?.split('=')[1] || process.env.SEO_BROWSER_BASE_URL || 'http://127.0.0.1:5173').replace(/\/+$/, '')
const scopeArg = process.argv.find((arg) => arg.startsWith('--scope=')) || '--scope=us1'
const scope = scopeArg.split('=')[1]
const evidenceDir = path.dirname(new URL(import.meta.url).pathname)
const routes = ['/', '/projects', '/projects/1', '/services', '/contact', '/about', '/hse', '/careers']
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

function slug(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
}

async function collect(page) {
  return page.evaluate(() => {
    const meta = (selector) => document.head.querySelector(selector)?.getAttribute('content') || ''
    const canonical = document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') || ''
    const robots = meta('meta[name="robots"]')
    const viewportWidth = window.innerWidth
    const doc = document.documentElement
    const visible = (element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    }
    const inHorizontalScroller = (element) => {
      let node = element.parentElement
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node)
        const canScroll = /(auto|scroll)/.test(style.overflowX)
        if (canScroll && node.scrollWidth > node.clientWidth + 2) return true
        node = node.parentElement
      }
      return false
    }
    const actionOverflow = Array.from(document.querySelectorAll('button,a,input,select,textarea,[role="button"]'))
      .map((element) => {
        if (!visible(element)) return null
        if (inHorizontalScroller(element)) return null
        const rect = element.getBoundingClientRect()
        if (rect.right > viewportWidth + 2 || rect.left < -2) {
          return {
            text: (element.textContent || element.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          }
        }
        return null
      })
      .filter(Boolean)

    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical,
      robots,
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      ogUrl: meta('meta[property="og:url"]'),
      ogImage: meta('meta[property="og:image"]'),
      ogType: meta('meta[property="og:type"]'),
      twitterCard: meta('meta[name="twitter:card"]'),
      twitterTitle: meta('meta[name="twitter:title"]'),
      twitterDescription: meta('meta[name="twitter:description"]'),
      twitterImage: meta('meta[name="twitter:image"]'),
      jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
      pageHorizontalScroll: Math.max(doc.scrollWidth, document.body?.scrollWidth || 0) > viewportWidth + 2,
      actionOverflow,
    }
  })
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 })
  for (const route of routes) {
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
      const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 15_000 })
      status = response?.status() || null
      await page.waitForTimeout(1200)
    } catch (error) {
      navError = error instanceof Error ? error.message : String(error)
    }

    const metadata = await collect(page).catch((error) => ({ error: error instanceof Error ? error.message : String(error) }))
    const screenshotPrefix = scope === 'all' ? 'T066' : scope === 'us2' ? 'T045' : 'T037'
    const screenshot = path.join(evidenceDir, `${screenshotPrefix}-${slug(route)}-${viewport.name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => null)
    const missing = []
    if (!metadata.title) missing.push('title')
    if (!metadata.description) missing.push('description')
    if (!metadata.canonical) missing.push('canonical')
    if (/localhost|127\.0\.0\.1/.test(metadata.canonical || '')) missing.push('canonical-localhost')
    if (!metadata.robots || !/index/.test(metadata.robots)) missing.push('robots-index')
    if (scope === 'us2' || scope === 'all') {
      if (!metadata.ogTitle) missing.push('og:title')
      if (!metadata.ogDescription) missing.push('og:description')
      if (!metadata.ogUrl) missing.push('og:url')
      if (metadata.ogUrl !== metadata.canonical) missing.push('og:url-canonical-mismatch')
      if (!metadata.ogImage) missing.push('og:image')
      if (/localhost|127\.0\.0\.1/.test(metadata.ogImage || '')) missing.push('og:image-localhost')
      if (!metadata.ogType) missing.push('og:type')
      if (!metadata.twitterCard) missing.push('twitter:card')
      if (!metadata.twitterTitle) missing.push('twitter:title')
      if (!metadata.twitterDescription) missing.push('twitter:description')
      if (!metadata.twitterImage) missing.push('twitter:image')
      if (/localhost|127\.0\.0\.1/.test(metadata.twitterImage || '')) missing.push('twitter:image-localhost')
    }
    if (metadata.pageHorizontalScroll) missing.push('horizontal-scroll')
    if ((metadata.actionOverflow || []).length) missing.push('action-overflow')

    results.push({
      route,
      viewport: viewport.name,
      status,
      navError,
      screenshot,
      metadata,
      consoleErrors,
      failedRequests,
      missing,
      pass: status === 200 && !navError && missing.length === 0,
    })
    await page.close()
  }
  await context.close()
}

await browser.close()

const outFile = scope === 'all' ? 'seo-browser-results.json' : scope === 'us2' ? 'seo-browser-us2-results.json' : 'seo-browser-us1-results.json'
await fs.writeFile(path.join(evidenceDir, outFile), JSON.stringify(results, null, 2))
const failed = results.filter((result) => !result.pass)
console.log(JSON.stringify({ total: results.length, failed: failed.length, failed: failed.map((item) => `${item.route}:${item.viewport}:${item.missing.join(',')}`) }, null, 2))
if (failed.length) process.exitCode = 1
