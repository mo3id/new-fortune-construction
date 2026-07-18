import axios from 'axios'

export type DashboardErrorCategory = 'runtime' | 'route' | 'chunk-load' | 'network' | 'api-unavailable' | 'not-found' | 'unknown'

export class DashboardError extends Error {
  category: DashboardErrorCategory
  status?: number

  constructor(message: string, category: DashboardErrorCategory = 'unknown', status?: number) {
    super(message)
    this.name = 'DashboardError'
    this.category = category
    this.status = status
  }
}

export function isDashboardError(error: unknown): error is DashboardError {
  return error instanceof DashboardError
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}

export function isChunkLoadError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase()
  return (
    message.includes('loading chunk') ||
    message.includes('chunkloaderror') ||
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('importing a module script failed')
  )
}

export function classifyDashboardError(error: unknown): DashboardErrorCategory {
  if (isDashboardError(error)) return error.category
  if (isChunkLoadError(error)) return 'chunk-load'

  if (axios.isAxiosError(error)) {
    if (!error.response) return 'network'
    if (error.response.status >= 500) return 'api-unavailable'
    if (error.response.status === 404) return 'not-found'
  }

  return 'unknown'
}

export function isNetworkUnavailableError(error: unknown): boolean {
  const category = classifyDashboardError(error)
  return category === 'network' || category === 'api-unavailable'
}

export function getSafeErrorMessage(error: unknown): string {
  const category = classifyDashboardError(error)

  if (category === 'chunk-load') {
    return 'The dashboard could not finish loading. Please reload to get the latest version.'
  }

  if (category === 'network' || category === 'api-unavailable') {
    return 'The dashboard could not reach the API right now. Please retry in a moment.'
  }

  if (category === 'not-found') {
    return 'The requested dashboard page could not be found.'
  }

  return 'Something went wrong in the dashboard. Please reload the page.'
}

export function getTechnicalDetails(error: unknown): string | undefined {
  if (!import.meta.env.DEV) return undefined
  if (error instanceof Error) return error.stack || error.message
  if (typeof error === 'string') return error
  return undefined
}
