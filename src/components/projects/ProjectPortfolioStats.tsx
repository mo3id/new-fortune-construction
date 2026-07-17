import type { LucideIcon } from 'lucide-react'

export interface PortfolioStat {
    label: string
    sublabel: string
    value: string
    unit?: string
    supportingText: string
    icon: LucideIcon
}

export function ProjectPortfolioStats({ stats }: { stats: PortfolioStat[] }) {
    return (
        <section className="relative z-20 -mt-16 px-4 md:px-6">
            <div className="mx-auto grid max-w-[1700px] grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.16)] xl:grid-cols-4 dark:border-slate-800 dark:bg-slate-950">
                {stats.map(({ label, sublabel, value, unit, supportingText, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex min-h-[118px] items-center gap-3 border-b border-r border-slate-200 px-4 py-5 last:border-r-0 even:border-r-0 xl:min-h-[132px] xl:gap-6 xl:px-8 xl:py-7 xl:even:border-r xl:last:border-r-0 dark:border-slate-800"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-teal-50 text-teal-700 xl:h-14 xl:w-14 dark:bg-teal-500/10 dark:text-teal-300">
                            <Icon className="h-6 w-6 stroke-[1.8] xl:h-8 xl:w-8" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold leading-none tracking-tight text-slate-950 sm:text-4xl xl:text-5xl dark:text-white">{value}</span>
                                {unit && <span className="pb-0.5 text-sm font-black text-slate-950 sm:text-base xl:pb-1 xl:text-xl dark:text-white">{unit}</span>}
                            </div>
                            <div className="mt-2 text-sm font-black leading-tight text-slate-800 xl:text-base dark:text-slate-100">{label}</div>
                            <div className="mt-1 text-xs font-semibold text-slate-400 xl:text-sm">{sublabel}</div>
                            <div className="mt-1 text-xs font-semibold text-slate-400">{supportingText}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
