import { Filter, Sparkles, Hammer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
    CATEGORY_FILTERS,
    CATEGORY_META,
    ProjectCategoryFilter,
    ProjectStatusFilter,
    STATUS_FILTERS,
    STATUS_META,
} from './portfolioConfig'

interface FilterButtonProps {
    active: boolean
    count: number
    icon: LucideIcon
    label: string
    onClick: () => void
}

function FilterButton({ active, count, icon: Icon, label, onClick }: FilterButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group/filter relative flex h-12 shrink-0 items-center gap-3 overflow-hidden border px-4 text-left transition-all duration-300 ${
                active
                    ? 'border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-900/15 dark:border-teal-400 dark:bg-teal-500 dark:text-slate-950'
                    : 'border-slate-200 bg-white/80 text-slate-600 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-white hover:text-slate-950 hover:shadow-lg hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:bg-slate-900 dark:hover:text-white'
            }`}
        >
            <span
                className={`flex h-7 w-7 items-center justify-center border ${
                    active
                        ? 'border-white/20 bg-white/10 dark:border-slate-950/15 dark:bg-slate-950/10'
                        : 'border-slate-200 bg-slate-50 text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-teal-300'
                }`}
            >
                <Icon className="h-4 w-4" />
            </span>
            <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.18em]">{label}</span>
                <span className={`mt-0.5 block text-[10px] font-bold uppercase tracking-[0.12em] ${active ? 'text-white/65 dark:text-slate-950/60' : 'text-slate-400'}`}>
                    {count} {count === 1 ? 'project' : 'projects'}
                </span>
            </span>
        </button>
    )
}

interface ProjectPortfolioFiltersProps {
    category: ProjectCategoryFilter
    categoryCounts: Record<ProjectCategoryFilter, number>
    filteredCount: number
    onCategoryChange: (category: ProjectCategoryFilter) => void
    onStatusChange: (status: ProjectStatusFilter) => void
    status: ProjectStatusFilter
    statusCounts: Record<ProjectStatusFilter, number>
}

export function ProjectPortfolioFilters({
    category,
    categoryCounts,
    filteredCount,
    onCategoryChange,
    onStatusChange,
    status,
    statusCounts,
}: ProjectPortfolioFiltersProps) {
    return (
        <div className="mb-10 overflow-hidden border border-slate-200 bg-white/95 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative p-7 md:p-10">
                    <div className="absolute right-0 top-0 hidden h-full w-px bg-slate-200 dark:bg-slate-800 lg:block" />
                    <div className="mb-6 inline-flex items-center gap-2 border border-teal-200 bg-teal-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-teal-800 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-300">
                        <Sparkles className="h-4 w-4" />
                        Portfolio intelligence
                    </div>
                    <h2 className="max-w-3xl text-4xl font-display font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                        Explore work by scale, sector, and delivery status.
                    </h2>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                        A case-study portfolio built for executive scanning, technical review, and quick comparison across active and completed work.
                    </p>
                </div>

                <div className="grid border-t border-slate-200 dark:border-slate-800 lg:border-t-0">
                    <div className="grid grid-cols-3">
                        <div className="border-r border-slate-200 p-6 dark:border-slate-800">
                            <div className="text-3xl font-display font-bold text-slate-950 dark:text-white">{filteredCount}</div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Visible Cases</div>
                        </div>
                        <div className="border-r border-slate-200 p-6 dark:border-slate-800">
                            <div className="truncate text-3xl font-display font-bold text-slate-950 dark:text-white">{category === 'All' ? 'All' : category}</div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Discipline</div>
                        </div>
                        <div className="p-6">
                            <div className="truncate text-3xl font-display font-bold text-slate-950 dark:text-white">{status === 'All' ? 'Live' : status}</div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Status View</div>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-teal-500 text-slate-950">
                                <Hammer className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">Selected lens</div>
                                <p className="mt-2 text-sm leading-7 text-slate-300">
                                    Showing {status === 'All' ? 'all delivery statuses' : status.toLowerCase()} within {category === 'All' ? 'the full portfolio' : `${category.toLowerCase()} projects`}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-200 p-5 dark:border-slate-800 md:p-6">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    <Filter className="h-4 w-4 text-teal-600" />
                    Browse by discipline
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {CATEGORY_FILTERS.map((item) => {
                        const meta = CATEGORY_META[item]
                        return (
                            <FilterButton
                                key={item}
                                label={meta.label}
                                icon={meta.icon}
                                count={categoryCounts[item]}
                                active={category === item}
                                onClick={() => onCategoryChange(item)}
                            />
                        )
                    })}
                </div>
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {STATUS_FILTERS.map((item) => {
                        const meta = STATUS_META[item]
                        return (
                            <FilterButton
                                key={item}
                                label={meta.label}
                                icon={meta.icon}
                                count={statusCounts[item]}
                                active={status === item}
                                onClick={() => onStatusChange(item)}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
