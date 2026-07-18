import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('/Users/mohamedeidali/Library/Caches/com.openai.codex/org.sparkle-project.Sparkle/Installation/4OX4kTEA7/EHi677UFs/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')

const base = 'http://localhost:5174'
const evidenceDir = path.dirname(new URL(import.meta.url).pathname)
const routes = ['/projects', '/content', '/messages', '/applications']
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

function routeSlug(route) {
  return route.replace(/^\//, '').replace(/\//g, '-')
}

async function login(page) {
  await page.goto(`${base}/login`, { waitUntil: 'networkidle', timeout: 25_000 })
  const tip = await page.locator('[title*="Username"]').first().getAttribute('title')
  const match = tip?.match(/Username:\s*([^/]+)\s*\/\s*Password:\s*(.+)$/)
  if (!match) throw new Error('Could not read local dashboard demo credentials from login page.')
  await page.locator('input[name="username"]').fill(match[1].trim())
  await page.locator('input[name="password"]').fill(match[2].trim())
  await page.getByRole('button', { name: /sign into dashboard/i }).click()
  await page.waitForURL(`${base}/`, { timeout: 25_000 })
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
    const scroller = document.querySelector('main') || document.scrollingElement
    if (!scroller) return
    scroller.scrollTo(0, Math.max(0, scroller.scrollHeight - scroller.clientHeight))
    await delay(120)
    scroller.scrollTo(0, 0)
    await delay(120)
  }).catch(() => null)
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const visible = (element) => {
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
    }

    const overflowOffenders = Array.from(document.body.querySelectorAll('*'))
      .map((element) => {
        if (!visible(element)) return null
        const rect = element.getBoundingClientRect()
        if (rect.right <= 2 || rect.left >= viewportWidth - 2) return null
        const rightOverflow = rect.right - viewportWidth
        const leftOverflow = -rect.left
        if (rightOverflow <= 2 && leftOverflow <= 2) return null
        return {
          tag: element.tagName.toLowerCase(),
          cls: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
          text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          rightOverflow: Math.round(rightOverflow),
          leftOverflow: Math.round(leftOverflow),
        }
      })
      .filter(Boolean)
      .slice(0, 10)

    const actionOverflow = Array.from(document.querySelectorAll('button,a,input,select,textarea,[role="button"]'))
      .map((element) => {
        if (!visible(element)) return null
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -2 || rect.top > viewportHeight + 2) return null
        if (rect.right <= 2 || rect.left >= viewportWidth - 2) return null
        if (rect.right <= viewportWidth + 2 && rect.left >= -2) return null
        return {
          text: (element.textContent || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '')
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }
      })
      .filter(Boolean)
      .slice(0, 10)

    const emptyText = Array.from(document.body.querySelectorAll('*'))
      .filter(visible)
      .map((element) => {
        const text = (element.textContent || '').trim().replace(/\s+/g, ' ')
        if (!/^No applications found matching your criteria$/.test(text)) return null
        const rect = element.getBoundingClientRect()
        return {
          tag: element.tagName.toLowerCase(),
          cls: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          fitsViewport: rect.left >= -2 && rect.right <= viewportWidth + 2,
        }
      })
      .filter(Boolean)

    return {
      path: window.location.pathname,
      scrollWidth: Math.max(doc.scrollWidth, document.body?.scrollWidth || 0),
      clientWidth: doc.clientWidth,
      innerWidth: viewportWidth,
      pageHorizontalScroll: Math.max(doc.scrollWidth, document.body?.scrollWidth || 0) > viewportWidth + 2,
      overflowOffenders,
      actionOverflow,
      tableCount: document.querySelectorAll('table').length,
      emptyText,
    }
  })
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})

const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  })
  const authPage = await context.newPage()
  await login(authPage)
  await authPage.close()

  for (const route of routes) {
    const page = await context.newPage()
    page.setDefaultTimeout(4_000)
    const consoleErrors = []
    const failedRequests = []

    page.on('console', (msg) => {
      if (['error', 'warning'].includes(msg.type())) {
        consoleErrors.push(`${msg.type()}: ${msg.text()}`)
      }
    })
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`)
    })

    console.log(`checking ${viewport.name} ${route}`)
    const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 15_000 })
    await page.waitForTimeout(1_500)
    if (route === '/applications') {
      await page.locator('input[placeholder*="Search"]').fill('__no_matching_application_for_us3__').catch(() => null)
      await page.waitForTimeout(300)
    }
    await autoScroll(page)
    const metrics = await collectMetrics(page)
    const screenshot = path.join(evidenceDir, `T060-us3-${routeSlug(route)}-${viewport.name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })

    results.push({
      task: 'T060',
      route,
      viewport: `${viewport.width}x${viewport.height}`,
      viewportName: viewport.name,
      status: response?.status() || null,
      screenshot,
      consoleErrors,
      failedRequests,
      metrics,
    })

    await page.close()
  }

  await context.close()
}

await browser.close()

await fs.writeFile(path.join(evidenceDir, 'dashboard-us3-browser-results.json'), JSON.stringify(results, null, 2))
console.log(JSON.stringify(results.map((result) => ({
  route: result.route,
  viewport: result.viewportName,
  status: result.status,
  console: result.consoleErrors.length,
  failed: result.failedRequests.length,
  horizontal: result.metrics.pageHorizontalScroll,
  actionOverflow: result.metrics.actionOverflow.length,
  emptyTextFits: result.metrics.emptyText.every((item) => item.fitsViewport),
  screenshot: path.basename(result.screenshot),
})), null, 2))
