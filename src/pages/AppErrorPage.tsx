import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@fortune/shared-ui'
import { SeoHead } from '@/components/SeoHead'
import { getSafeErrorMessage, getTechnicalDetails } from '@/lib/errorHandling'
import { seoProfiles } from '@/lib/seo'

interface AppErrorPageProps {
    error?: unknown
    resetError?: () => void
}

export default function AppErrorPage({ error, resetError }: AppErrorPageProps) {
    const resolvedError = error
    const technicalDetails = getTechnicalDetails(resolvedError)

    const handleReload = () => {
        resetError?.()
        window.location.reload()
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-50 px-6 py-16 text-slate-950 dark:bg-slate-950 dark:text-white">
            <SeoHead profile={seoProfiles.appError} />
            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
                <div className="border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-10">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                        <AlertTriangle className="h-7 w-7" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.26em] text-teal-700 dark:text-teal-300">Application error</p>
                    <h1 className="mt-4 text-4xl font-display font-bold tracking-tight md:text-5xl">
                        Something went wrong.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        {getSafeErrorMessage(resolvedError)}
                    </p>

                    {technicalDetails && (
                        <pre className="mt-6 max-h-52 overflow-auto whitespace-pre-wrap break-words bg-slate-100 p-4 text-left text-xs text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                            {technicalDetails}
                        </pre>
                    )}

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button type="button" onClick={handleReload}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reload
                        </Button>
                        <a href="/" className="inline-flex h-11 items-center justify-center border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
