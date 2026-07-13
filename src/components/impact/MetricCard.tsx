import { AnimatedCounter } from './AnimatedCounter'
import { cn } from '@/lib/utils'
import { MetricCardProps } from '@/types'

export function MetricCard({ metric, index, isVisible }: MetricCardProps) {
    return (
        <div
            className={cn(
                `reveal reveal-delay-${index + 1}`,
                "bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-10 text-center shadow-xl shadow-slate-200/50 dark:shadow-black/20 group hover:-translate-y-2 transition-all duration-500"
            )}
        >
            <div className={cn(
                "w-20 h-24 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 transition-all duration-500 relative overflow-hidden",
                "group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-teal-500/20",
                metric.color
            )}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 scale-125">{metric.icon}</div>
            </div>
            <p className="font-display text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter drop-shadow-sm">
                <AnimatedCounter target={metric.target} suffix={metric.suffix} isVisible={isVisible} />
            </p>
            <p className="font-black text-teal-600 dark:text-teal-400 mb-4 text-[10px] tracking-[0.3em] uppercase">{metric.label}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-light">{metric.description}</p>
        </div>
    )
}
