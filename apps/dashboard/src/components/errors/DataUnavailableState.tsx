import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@fortune/shared-ui'
import { getTechnicalDetails } from '../../lib/errorHandling'

interface DataUnavailableStateProps {
  title?: string
  message?: string
  resourceLabel?: string
  error?: unknown
  onRetry?: () => void
  className?: string
}

export function DataUnavailableState({
  title = 'Data temporarily unavailable',
  message,
  resourceLabel = 'dashboard data',
  error,
  onRetry,
  className = '',
}: DataUnavailableStateProps) {
  const technicalDetails = getTechnicalDetails(error)

  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 text-slate-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-white ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-display font-bold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {message || `We could not load ${resourceLabel} right now. Please retry in a moment.`}
          </p>
          {technicalDetails && (
            <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-left text-xs text-amber-900 dark:bg-slate-950/70 dark:text-amber-100">
              {technicalDetails}
            </pre>
          )}
          {onRetry && (
            <Button type="button" className="mt-5" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
