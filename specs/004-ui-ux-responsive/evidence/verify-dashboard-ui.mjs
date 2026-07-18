import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('/Users/mohamedeidali/Library/Caches/com.openai.codex/org.sparkle-project.Sparkle/Installation/4OX4kTEA7/EHi677UFs/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright')

const base = 'http://localhost:5174'
const evidenceDir = path.dirname(new URL(import.meta.url).pathname)

const targets = [
  { task: 'T035', group: 'shell-overview', routes: ['/'] },
  { task: 'T036', group: 'projects-categories', routes: ['/projects', '/project-categories'] },
  { task: 'T037', group: 'services-partners-team', routes: ['/services', '/partners', '/team'] },
  { task: 'T038', group: 'jobs-settings-content', routes: ['/jobs', '/settings', '/content'] },
  { task: 'T039', group: 'messages-applications', routes: ['/messages', '/applications'] },
]

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

function routeSlug(route) {
  return route === '/' ? 'dashboard-home' : route.replace(/^\//, '').replace(/\//g, '-')
}

async function login(page) {
  await page.goto(`${base}/login`, { waitUntil: 'networkidle', timeout: 25_000 })
  const tip = await page.locator('[title*="Username"]').first().getAttribute('title')
  const match = tip?.match(/Username:\s*([^/]+)\s*\/\s*Password:\s*(.+)$/)
  if (!match) throw new Error('Could not read local dashboard demo credentials from login page.')
  const username = match[1].trim()
  const password = match[2].trim()
  await page.locator('input[name="username"]').fill(username)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: /sign into dashboard/i }).click()
  await page.waitForURL(`${base}/`, { timeout: 25_000 })
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
    const scroller = document.querySelector('main') || document.scrollingElement
    if (scroller) {
      scroller.scrollTo(0, Math.max(0, scroller.scrollHeight - scroller.clientHeight))
      await delay(180)
      scroller.scrollTo(0, 0)
    }
    await delay(120)
  })
}

async function tryOpenSafeModal(page) {
  const candidates = page.locator('button').filter({
    hasText: /add|edit|view|details|open|manage|create/i,
  })

  const count = await candidates.count().catch(() => 0)
  for (let i = 0; i < Math.min(count, 8); i += 1) {
    const button = candidates.nth(i)
    const text = (await button.innerText().catch(() => '')).trim()
    if (/delete|remove|disable|archive|mark|read|unread|submit|save|update/i.test(text)) continue
    const box = await button.boundingBox().catch(() => null)
    if (!box) continue
    await button.click({ timeout: 2_000 }).catch(() => null)
    await page.waitForTimeout(300).catch(() => null)
    const modalVisible = await page.locator('[role="dialog"], [data-slot="dialog-content"]').first().isVisible().catch(() => false)
    if (modalVisible) {
      return { opened: true, trigger: text || 'icon/unnamed button' }
    }
  }
  return { opened: false, trigger: null }
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const body = document.body
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const pageWidth = Math.max(doc.scrollWidth, body?.scrollWidth || 0)

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
      .slice(0, 10)

    const actionOverflow = Array.from(document.querySelectorAll('button,a,input,select,textarea,[role="button"]'))
      .map((element) => {
        if (!visible(element)) return null
        const rect = element.getBoundingClientRect()
        if (rect.bottom < -2 || rect.top > viewportHeight + 2) return null
        if (rect.right <= 2 || rect.left >= viewportWidth - 2) return null
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
      .slice(0, 10)

    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [data-slot="dialog-content"]')).filter(visible)
    const dialogMetrics = dialogs.map((dialog) => {
      const rect = dialog.getBoundingClientRect()
      return {
        text: (dialog.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
        fitsViewport: rect.top >= -2 && rect.bottom <= viewportHeight + 2,
        hasInternalScroll: dialog.scrollHeight > dialog.clientHeight + 2,
        actionButtons: Array.from(dialog.querySelectorAll('button')).filter(visible).length,
      }
    })

    const tableSummaries = Array.from(document.querySelectorAll('table')).filter(visible).map((table) => ({
      rows: table.querySelectorAll('tbody tr').length,
      headers: table.querySelectorAll('th').length,
      wrapperScrolls: Boolean(table.closest('[class*="overflow-x-auto"]')),
    }))

    const forms = Array.from(document.querySelectorAll('form')).filter(visible).map((form) => ({
      inputs: form.querySelectorAll('input,textarea,select,[role="combobox"]').length,
      labels: form.querySelectorAll('label').length,
      buttons: form.querySelectorAll('button').length,
    }))

    return {
      title: document.title,
      path: window.location.pathname,
      scrollWidth: pageWidth,
      clientWidth: doc.clientWidth,
      innerWidth: viewportWidth,
      pageHorizontalScroll: pageWidth > viewportWidth + 2,
      overflowOffenders,
      actionOverflow,
      tables: tableSummaries,
      forms,
      dialogs: dialogMetrics,
      emptyTextPresent: /no .*found|no .*yet|empty|pending/i.test(document.body.innerText || ''),
      bodyTextLength: (document.body.innerText || '').length,
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
  const page = await context.newPage()
  await login(page)
  await page.close()

  for (const target of targets) {
    for (const route of target.routes) {
      const page = await context.newPage()
      page.setDefaultTimeout(3_000)
      console.log(`checking ${viewport.name} ${route}`)
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
        const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 12_000 })
        responseStatus = response?.status() || null
        await page.waitForTimeout(1_500)
      } catch (error) {
        navError = error instanceof Error ? error.message : String(error)
        try {
          await page.waitForLoadState('domcontentloaded', { timeout: 5_000 })
        } catch {}
      }

      await autoScroll(page)
      const beforeModal = await collectMetrics(page)
      const modalAttempt = await tryOpenSafeModal(page)
      await page.waitForTimeout(200).catch(() => null)
      const afterModal = await collectMetrics(page)

      const screenshot = path.join(evidenceDir, `${target.task}-${routeSlug(route)}-${viewport.name}.png`)
      await page.screenshot({ path: screenshot, fullPage: true })

      await page.keyboard.press('Escape').catch(() => null)

      results.push({
        task: target.task,
        group: target.group,
        route,
        viewport: `${viewport.width}x${viewport.height}`,
        viewportName: viewport.name,
        status: responseStatus,
        navError,
        screenshot,
        consoleErrors,
        failedRequests,
        modalAttempt,
        metrics: beforeModal,
        modalMetrics: afterModal,
      })

      await page.close()
    }
  }

  await context.close()
}

await browser.close()

await fs.writeFile(path.join(evidenceDir, 'dashboard-browser-results.json'), JSON.stringify(results, null, 2))

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
  tables: result.metrics.tables.length,
  forms: result.metrics.forms.length,
  modalOpened: result.modalAttempt.opened,
  modalFits: result.modalMetrics.dialogs.every((dialog) => dialog.fitsViewport),
  screenshot: path.basename(result.screenshot),
})), null, 2))
