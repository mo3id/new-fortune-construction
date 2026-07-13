import { toast } from 'sonner'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

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
      throw new Error(`API ${path} → ${res.status}`)
    }
    
    return res.json() as Promise<T>
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError = 'Connection failed. Please check your internet.'
      if (showErrors) {
        toast.error(networkError)
      }
      throw new Error(networkError)
    }
    throw error
  }
}
