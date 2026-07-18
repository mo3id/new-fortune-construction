import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('/Users/mohamedeidali/Library/Caches/com.openai.codex/org.sparkle-project.Sparkle/Installation/4OX4kTEA7/EHi677UFs/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')

const base = 'http://127.0.0.1:5173'
const evidenceDir = path.dirname(new URL(import.meta.url).pathname)

const routes = [
  { task: 'T019', route: '/' },
  { task: 'T020', route: '/projects' },
  { task: 'T021', route: '/projects/1' },
  { task: 'T022', route: '/careers' },
  { task: 'T023', route: '/contact' },
  { task: 'T024', route: '/about' },
  { task: 'T024', route: '/hse' },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

function routeSlug(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
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

  for (const target of routes) {
    const page = await context.newPage()
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

    let responseStatus = null
    let navError = null

    try {
      const response = await page.goto(`${base}${target.route}`, { waitUntil: 'networkidle', timeout: 25_000 })
      responseStatus = response?.status() || null
      await page.waitForTimeout(1_000)
    } catch (error) {
      navError = error instanceof Error ? error.message : String(error)
      try {
        await page.waitForLoadState('domcontentloaded', { timeout: 5_000 })
      } catch {
        // Keep the navigation error as the primary evidence.
      }
    }

    await page.evaluate(async () => {
      const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
      const step = Math.max(320, Math.floor(window.innerHeight * 0.65))
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await delay(120)
      }
      window.scrollTo(0, 0)
      await delay(250)
    })

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const body = document.body
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const pageWidth = Math.max(doc.scrollWidth, body?.scrollWidth || 0)

      const overflowOffenders = Array.from(document.body.querySelectorAll('*'))
        .map((element) => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)
          if (rect.width === 0 || rect.height === 0 || style.visibility === 'hidden' || style.display === 'none') {
            return null
          }

          const rightOverflow = rect.right - viewportWidth
          const leftOverflow = -rect.left
          if (rightOverflow > 2 || leftOverflow > 2) {
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
          }
          return null
        })
        .filter(Boolean)
        .slice(0, 8)

      const actionOverflow = Array.from(document.querySelectorAll('button,a,input,select,textarea'))
        .map((element) => {
          const rect = element.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) return null
          if (rect.bottom < -2 || rect.top > viewportHeight + 2) return null
          if (rect.right > viewportWidth + 2 || rect.left < -2) {
            return {
              text: (element.textContent || element.getAttribute('aria-label') || element.getAttribute('placeholder') || '')
                .trim()
                .replace(/\s+/g, ' ')
                .slice(0, 80),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            }
          }
          return null
        })
        .filter(Boolean)
        .slice(0, 8)

      return {
        title: document.title,
        path: window.location.pathname,
        scrollWidth: pageWidth,
        clientWidth: doc.clientWidth,
        innerWidth: viewportWidth,
        bodyTextLength: (body?.innerText || '').length,
        pageHorizontalScroll: pageWidth > viewportWidth + 2,
        overflowOffenders,
        actionOverflow,
      }
    })

    const screenshot = path.join(evidenceDir, `${target.task}-${routeSlug(target.route)}-${viewport.name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })

    results.push({
      ...target,
      viewport: `${viewport.width}x${viewport.height}`,
      viewportName: viewport.name,
      status: responseStatus,
      navError,
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

await fs.writeFile(path.join(evidenceDir, 'public-browser-results.json'), JSON.stringify(results, null, 2))

console.log(JSON.stringify(results.map((result) => ({
  task: result.task,
  route: result.route,
  viewport: result.viewportName,
  status: result.status,
  navError: Boolean(result.navError),
  horizontal: result.metrics.pageHorizontalScroll,
  failed: result.failedRequests.length,
  console: result.consoleErrors.length,
  offenders: result.metrics.overflowOffenders.length,
  actionOverflow: result.metrics.actionOverflow.length,
  screenshot: path.basename(result.screenshot),
})), null, 2))
