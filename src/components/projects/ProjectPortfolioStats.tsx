import type { LucideIcon } from 'lucide-react'

export interface PortfolioStat {
    label: string
    value: string
    supportingText: string
    icon: LucideIcon
}

export function ProjectPortfolioStats({ stats }: { stats: PortfolioStat[] }) {
    return (
        <section className="relative -mt-16 z-20 px-6">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map(({ label, value, supportingText, icon: Icon }) => (
                    <div
                        key={label}
                        className="border border-slate-200/80 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="mb-5 flex h-11 w-11 items-center justify-center bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-3xl font-display font-bold leading-none text-slate-950 dark:text-white">{value}</div>
                        <div className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</div>
                        <div className="mt-2 text-xs font-medium leading-5 text-slate-400">{supportingText}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}
