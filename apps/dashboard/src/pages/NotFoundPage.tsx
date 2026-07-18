import { Home, SearchX } from 'lucide-react'
import { Button } from '@fortune/shared-ui'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <main className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-teal-300 dark:bg-white dark:text-teal-700">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">404</p>
        <h1 className="mt-3 text-3xl font-display font-bold text-slate-950 dark:text-white">Dashboard page not found</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
          The dashboard route you opened is not available. Return to the overview and choose a section from the navigation.
        </p>
        <Button type="button" className="mt-7" onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Overview
        </Button>
      </main>
    </div>
  )
}
