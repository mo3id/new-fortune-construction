import { cn } from '@/lib/utils'
import { TimelineItemProps } from '@/types'
import { motion } from 'framer-motion'

export function TimelineItem({ event, index }: TimelineItemProps) {
    const isEven = index % 2 === 0

    return (
        <div
            className={cn(
                "relative flex flex-col md:flex-row gap-12 md:gap-24",
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
            )}
        >
            {/* Timeline node */}
            <div
                className={cn(
                    "absolute left-6 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 overflow-hidden group",
                    event.highlight
                        ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/20'
                        : 'bg-slate-800 dark:bg-slate-900 text-slate-400 border border-slate-700/50'
                )}
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">{event.icon}</div>
            </div>

            {/* Year label (desktop center) */}
            <div className={cn(
                "hidden md:flex items-center justify-center w-1/2",
                isEven ? 'justify-end pr-20' : 'justify-start pl-20'
            )}>
                <span className={cn(
                    "font-display text-7xl font-black tracking-tighter transition-all duration-700",
                    event.highlight ? 'text-teal-500 drop-shadow-2xl' : 'text-slate-800 dark:text-slate-900'
                )}>
                    {event.year}
                </span>
            </div>

            {/* Content */}
            <div className={cn(
                "ml-20 md:ml-0 md:w-1/2",
                isEven ? 'md:pl-20' : 'md:pr-20'
            )}>
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.08] transition-all duration-500 group relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="md:hidden font-display text-4xl font-black text-teal-500 block mb-4 tracking-tighter">{event.year}</span>
                    <h3 className="font-display text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-teal-400 transition-colors">{event.title}</h3>
                    <p className="text-slate-400 text-base leading-relaxed font-light">{event.description}</p>
                </motion.div>
            </div>
        </div>
    )
}
