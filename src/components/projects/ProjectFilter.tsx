import { cn } from '@/lib/utils'
import { ProjectFilterProps } from '@/types'

export function ProjectFilter({
    categories,
    activeCategory,
    onCategoryChange,
}: ProjectFilterProps) {
    return (
        <div className="flex items-center justify-center gap-3 mb-16 flex-wrap">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={cn(
                        'px-8 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl border transition-all duration-500',
                        activeCategory === cat
                            ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20 scale-105'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-500/30 hover:text-teal-600'
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}
