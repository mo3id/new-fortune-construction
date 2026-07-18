import { toast } from 'sonner'
import { AppError } from '@/lib/errorHandling'

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (configured) return normalizeBaseUrl(configured)

  if (import.meta.env.PROD) {
    throw new Error('VITE_API_URL must be configured for production builds.')
  }

  return 'http://localhost:3001'
}

const BASE = resolveApiBaseUrl()

export const API = `${BASE}/api`

export async function apiFetch<T>(path: string, showErrors = false): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`)
    
    if (!res.ok) {
      const errorMessage = res.status === 404 
        ? 'Resource not found'
        : res.status === 500
        ? 'Server error. Please try again later.'
        : `Request failed with status ${res.status}`
      
      if (showErrors) {
        toast.error(errorMessage)
      }
      throw new AppError(
        `API ${path} returned ${res.status}`,
        res.status === 404 ? 'not-found' : res.status >= 500 ? 'api-unavailable' : 'unknown',
        res.status,
      )
    }
    
    return res.json() as Promise<T>
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError = 'Connection failed. Please check your internet.'
      if (showErrors) {
        toast.error(networkError)
      }
      throw new AppError(networkError, 'network')
    }
    throw error
  }
}
