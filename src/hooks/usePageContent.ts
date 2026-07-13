import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/apiClient'

export function usePageContent<T = Record<string, unknown>>(page: string) {
  return useQuery<T>({
    queryKey: ['pageContent', page],
    queryFn: () => apiFetch<T>(`/content/${page}`),
    staleTime: 60_000,
  })
}
