import { Link } from 'react-router-dom'
import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { SeoHead } from '@/components/SeoHead'
import { seoProfiles } from '@/lib/seo'

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white px-6 py-16 text-slate-950 dark:bg-slate-950 dark:text-white">
            <SeoHead profile={seoProfiles.notFound} />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                    <div className="flex h-52 w-full items-center justify-center bg-slate-950 text-white dark:bg-white dark:text-slate-950 lg:h-80">
                        <div className="text-center">
                            <SearchX className="mx-auto mb-5 h-14 w-14 text-teal-300 dark:text-teal-700" />
                            <p className="font-display text-7xl font-black tracking-tight md:text-8xl">404</p>
                        </div>
                    </div>
                    <section>
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-teal-700 dark:text-teal-300">Page not found</p>
                        <h1 className="mt-4 text-4xl font-display font-bold tracking-tight md:text-6xl">
                            We could not find that page.
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                            The link may be outdated, mistyped, or no longer available. You can return home or review the project portfolio.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link to="/" className="inline-flex h-11 items-center justify-center bg-teal-600 px-5 text-sm font-bold text-white transition-colors hover:bg-teal-500">
                                <Home className="mr-2 h-4 w-4" />
                                Home
                            </Link>
                            <Link to="/projects" className="inline-flex h-11 items-center justify-center border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Projects
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
